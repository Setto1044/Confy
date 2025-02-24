package com.confy.controller.stt;

import com.confy.common.responseDto.ApiResponseDto;
import com.confy.dto.MMSToClient.SttRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/stt")
public class SttController {

    private final RedisTemplate<String, Object> redisTemplate; //redis를 사용하기 위함

    @PostMapping(value = "/{meetingId}")
    public ResponseEntity<ApiResponseDto<Map<String, String>>> createUUID(@RequestHeader("X-User-Id") Long id, @PathVariable("meetingId") Long meetingId, @RequestBody SttRequestDto dto) {

        try{
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

            Map<String, Object> sentence = Map.of(
                    "speaker", dto.getSpeaker(),
                    "content", dto.getContent(),
                    "timestamp", timestamp,
                    "user_id", id
            );

            //Redis에 저장
            redisTemplate.opsForStream().add(
                    StreamRecords.newRecord()
                            .ofObject(sentence)
                            .withStreamKey(String.valueOf(meetingId))
            );

            log.info("STT 데이터 Redis Streams에 저장됨: meetingId={}, speaker={}, sentence={}", meetingId, dto.getSpeaker(), sentence);

            return ResponseEntity.ok(ApiResponseDto.success(meetingId + "에 STT 데이터 저장 완료"));

        } catch (RedisConnectionFailureException e) {
            log.error("Redis 연결 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(400).body(ApiResponseDto.error("Redis 연결에 실패했습니다."));

        } catch (DataAccessException e) {
            log.error("Redis 데이터 저장 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(400).body(ApiResponseDto.error("Redis 데이터 저장 중 오류가 발생했습니다."));

        } catch (Exception e) {
            log.error("예기치 못한 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(400).body(ApiResponseDto.error("STT 데이터 저장 중 예기치 못한 오류가 발생했습니다."));
        }

    }

}
