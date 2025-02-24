package com.confy.service.redis;

import com.confy.common.responseDto.ApiResponseDto;
import com.confy.dto.MMSToClient.ScriptResponseDto;
import com.confy.dto.MMSToClient.SentenceDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/meetings/redis")
public class RedisController {

    private final RedisService redisService;

    @GetMapping("/{meetingID}")
    public ResponseEntity<ApiResponseDto<ScriptResponseDto>> getMeetingScriptById(@PathVariable("meetingID") Long meetingID) {
        List<SentenceDto> sentences = redisService.getScript(meetingID);
        return ResponseEntity.ok(ApiResponseDto.success("회의 스크립트 조회 성공", new ScriptResponseDto(
                sentences
        )));
    }
}
