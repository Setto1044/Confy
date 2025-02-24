package com.confy.service.stt;

import com.confy.dto.MMSToClient.MeetingScriptResponseDto;
import com.confy.dto.MMSToClient.SentenceDto;
import com.confy.entity.Meeting;
import com.confy.entity.Sentence;
import com.confy.repository.MeetingRepository;
import com.confy.repository.SentenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Range;
import org.springframework.data.redis.core.StreamOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SttServiceImpl implements SttService {

    private final StringRedisTemplate stringRedisTemplate;
    private final SentenceRepository sentenceRepository;
    private final MeetingRepository meetingRepository;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");


    @Override
    @Transactional
    public void saveSttDataToDatabase(Long meetingId) {

        log.info("[비동기 작업 시작] 회의 종료 후 STT 데이터를 MySQL에 저장 중... (meetingId={})", meetingId);

        String streamKey = String.valueOf(meetingId);
        StreamOperations<String, Object, Object> streamOps = stringRedisTemplate.opsForStream();

        //Redis에서 STT 데이터 조회
        List<Map<Object, Object>> sttRecords = streamOps.range(streamKey, Range.unbounded())
                .stream()
                .map(record -> record.getValue())
                .map(value -> (Map<Object, Object>) value)
                .collect(Collectors.toList());

        if(sttRecords.isEmpty()){
            log.info("Redis에 저장된 STT 데이터가 없습니다. meetingId={}", meetingId);
            return;
        }

        //해당 meeting 엔티티 조회
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() ->  new IllegalArgumentException("해당 meetingId가 존재하지 않습니다: " + meetingId));

        //Sentence 리스트 생성
        List<Sentence> sentences = sttRecords.stream().map(data -> {
            try{
                String speaker = data.get("speaker").toString().replaceAll("^\"|\"$", "");
                String content = data.get("content").toString().replaceAll("^\"|\"$", "");
                String timestamp = data.get("timestamp").toString().replaceAll("^\"|\"$", "");
                String userId = data.get("user_id").toString().replaceAll("^\"|\"$", "");

                return Sentence.builder()
                        .meeting(meeting)
                        .speaker(speaker)
                        .content(content)
                        .timestamp(LocalDateTime.parse(timestamp))
                        .userId(Long.valueOf(userId))
                        .build();
            } catch (Exception e) {
                log.info("데이터 변환 중 오류 발생: {}", e.getMessage(), e);
                throw new RuntimeException("데이터 변환 오류", e);
            }

        }).collect(Collectors.toList());

        //STT 데이터 MySQL에 저장
        sentenceRepository.saveAll(sentences);
        log.info("Redis STT 데이터를 MySQL로 저장 완료. meetingId={}, 저장된 문장 수={}", meetingId, sentences.size());

        // Redis 데이터 삭제
        stringRedisTemplate.delete(streamKey);

    }

    @Override
    public MeetingScriptResponseDto getScript(Long meetingId, Long startTime, Long endTime) {
        log.info("[비동기 작업 시작] 회의 도중 스크립트 조회 (meetingId={})", meetingId);

        String streamKey = String.valueOf(meetingId);
        StreamOperations<String, Object, Object> streamOps = stringRedisTemplate.opsForStream();

        //Redis에서 사용하는 시간단위로 변환해준다.
        Instant nowInstant = Instant.now();
        Instant startInstant = (startTime != null) ? nowInstant.minusMillis(startTime * 60 * 1000) : null;
        Instant endInstant = (endTime != null) ? nowInstant.minusMillis(endTime * 60 * 1000) : null;

        String startId = (startInstant != null) ? startInstant.toEpochMilli() + "-0" : "-";
        String endId = (endInstant != null) ? endInstant.toEpochMilli() + "-0" : "+";

        //Redis Range 설정(시간이 null이면 전체 조회)
        Range<String> range = (startTime != null && endTime != null) ?
                Range.closed(startId, endId) :
                Range.unbounded();

        //Redis에서 STT 데이터 조회
        List<Map<Object, Object>> sttRecords = streamOps.range(streamKey, range)
                .stream()
                .map(record -> record.getValue())
                .map(value -> (Map<Object, Object>) value)
                .collect(Collectors.toList());

        if(sttRecords.isEmpty()){
            log.info("Redis에 저장된 STT 데이터가 없습니다. meetingId={}", meetingId);
            throw new IllegalArgumentException("스크립트 데이터가 없습니다.");
        }

        List<SentenceDto> sentenceList = sttRecords.stream().map(data -> {
            try {
                String speaker = data.get("speaker").toString().replaceAll("^\"|\"$", "");
                String content = data.get("content").toString().replaceAll("^\"|\"$", "");
                String timestamp = data.get("timestamp").toString().replaceAll("^\"|\"$", "");

                return SentenceDto.of(speaker, content, LocalDateTime.parse(timestamp));

            } catch (Exception e) {
                log.error("데이터 변환 중 오류 발생: {}", e.getMessage(), e);
                throw new RuntimeException("데이터 변환 오류", e);
            }
        }).collect(Collectors.toList());

        return MeetingScriptResponseDto.of(sentenceList);
    }

}
