package com.confy.service.redis;

import com.confy.dto.MMSToClient.SentenceDto;
import com.confy.vo.SentenceVo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Range;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.StreamOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final StringRedisTemplate stringRedisTemplate;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    /**
     * Redis에서 특정 회의 ID의 전체 스크립트 조회
     */
    @Override
    public List<SentenceDto> getScript(Long meetingId) {
        String streamKey = String.valueOf(meetingId);
        StreamOperations<String, String, String> streamOps = stringRedisTemplate.opsForStream();

        // Redis Stream에서 모든 데이터 조회
        List<MapRecord<String, String, String>> records = streamOps.range(streamKey, Range.unbounded());

        if (records == null || records.isEmpty()) {
            log.info("Redis에서 회의 기록을 찾을 수 없음. meetingId={}", meetingId);
            return Collections.emptyList();
        }

        return records.stream()
                .map(record -> new SentenceDto(
                        record.getValue().get("speaker"),
                        record.getValue().get("content"),
                        LocalDateTime.parse(record.getValue().get("timestamp")) // 문자열 → LocalDateTime 변환
                ))
                .sorted(Comparator.comparing(SentenceDto::getTimestamp)) // 시간순 정렬
                .collect(Collectors.toList());
    }

    /**
     * Redis에서 특정 시간 범위 내의 문장 조회
     */
    @Override
    public List<SentenceVo> getSentencesByTime(Long meetingId, String start, String end) {
        String streamKey = String.valueOf(meetingId);
        StreamOperations<String, String, String> streamOps = stringRedisTemplate.opsForStream();

        // 시작 및 종료 시간 변환
        LocalDateTime startTime = LocalDateTime.parse(start, formatter);
        LocalDateTime endTime = LocalDateTime.parse(end, formatter);

        // Redis에서 전체 데이터 조회 후 필터링
        List<MapRecord<String, String, String>> records = streamOps.range(streamKey, Range.unbounded());

        if (records == null || records.isEmpty()) {
            log.info("Redis에서 회의 기록을 찾을 수 없음. meetingId={}", meetingId);
            return Collections.emptyList();
        }

        return records.stream()
                .map(record -> mapToSentenceVo(record.getValue()))
                .filter(sentence -> isWithinTimeRange(sentence.getTimestamp(), startTime, endTime))
                .sorted(Comparator.comparing(SentenceVo::getTimestamp))
                .collect(Collectors.toList());
    }

    /**
     * Redis에 새로운 문장 추가
     */
    @Override
    @Transactional
    public void addSentence(Long meetingId, SentenceVo sentenceVo) {
        String streamKey = String.valueOf(meetingId);
        StreamOperations<String, String, String> streamOps = stringRedisTemplate.opsForStream();

        Map<String, String> valueMap = new HashMap<>();
        valueMap.put("speaker", sentenceVo.getSpeaker());
        valueMap.put("content", sentenceVo.getContent());
        valueMap.put("timestamp", sentenceVo.getTimestamp().format(formatter));
        valueMap.put("user_id", sentenceVo.getUserId().toString());

        streamOps.add(streamKey, valueMap);
        log.info("Redis에 문장 추가 완료. meetingId={}, speaker={}, timestamp={}",
                meetingId, sentenceVo.getSpeaker(), sentenceVo.getTimestamp());
    }

    /**
     * Redis에서 가져온 데이터를 SentenceVo로 변환
     */
    private SentenceVo mapToSentenceVo(Map<String, String> valueMap) {
        try {
            return SentenceVo.builder()
                    .speaker(valueMap.get("speaker"))
                    .content(valueMap.get("content"))
                    .timestamp(LocalDateTime.parse(valueMap.get("timestamp"), formatter))
                    .userId(Long.valueOf(valueMap.get("user_id")))
                    .build();
        } catch (Exception e) {
            log.error("Redis 데이터 변환 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("데이터 변환 오류", e);
        }
    }

    /**
     * 특정 시간 범위 내에 포함되는지 확인
     */
    private boolean isWithinTimeRange(LocalDateTime timestamp, LocalDateTime start, LocalDateTime end) {
        return !timestamp.isBefore(start) && !timestamp.isAfter(end);
    }
}
