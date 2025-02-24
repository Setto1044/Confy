package com.confy.controller.meeting.MMSToClient;

import com.confy.common.responseDto.ApiResponseDto;
import com.confy.dto.MMSToClient.*;
import com.confy.service.meeting.MMSToClient.MeetingResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/meetings/results")
public class MeetingResultController {

    private final MeetingResultService meetingResultService;

    @GetMapping("/{meetingId}/scripts")
    public ResponseEntity<ApiResponseDto<ScriptResponseDto>> getMeetingScript(@PathVariable Long meetingId) {
        ScriptResponseDto responseDto = meetingResultService.findScript(meetingId);
        if (responseDto.getScript().isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponseDto.error("해당 회의의 대본을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(ApiResponseDto.success("회의 대본 조회 성공", responseDto));
    }

    @GetMapping("/{meetingId}/visual")
    public ResponseEntity<ApiResponseDto<String>> getVisual(@PathVariable Long meetingId) {
        VisualResponseDto responseDto = meetingResultService.findVisualJson(meetingId);
        if (responseDto.getVisualJson().isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponseDto.error("해당 회의의 시각화 json을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(ApiResponseDto.success("회의 시각화 json 조회 성공", responseDto.getVisualJson()));
    }

    @GetMapping("/{meetingId}/summary")
    public ResponseEntity<ApiResponseDto<String>> getSummary(@PathVariable Long meetingId) {
        TextSummaryResponseDto responseDto = meetingResultService.findTextSummary(meetingId);
        if (responseDto.getTextSummary().isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponseDto.error("해당 회의의 마크다운 요약을 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(ApiResponseDto.success("회의 마크다운 요약 조회 성공", responseDto.getTextSummary()));
    }

    @GetMapping("/{meetingId}/keywords")
    public ResponseEntity<ApiResponseDto<KeywordsResponseDto>> getKeywords(@PathVariable Long meetingId) {
        KeywordsResponseDto responseDto = meetingResultService.findKeywords(meetingId);
        if (responseDto.getKeywords().isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponseDto.error("해당 회의의 키워드를 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(ApiResponseDto.success("회의 키워드 조회 성공", responseDto));
    }

    @GetMapping("/{meetingId}/visual/edit")
    public ResponseEntity<ApiResponseDto<Void>> checkVisualEditPermission(@RequestHeader("X-User-Id") Long id, @PathVariable Long meetingId) {
        return meetingResultService.canEditResult(id, meetingId) ?
                ResponseEntity.ok(ApiResponseDto.success("시각화 수정 모드 전환 성공")) :
                ResponseEntity.status(403).body(ApiResponseDto.error("수정 권한이 없습니다."));
    }

    @PostMapping("/{meetingId}/visual/save")
    public ResponseEntity<ApiResponseDto<Void>> updateVisual(@RequestBody VisualEditRequestDto requestDto, @PathVariable Long meetingId) {
        try {
            meetingResultService.updateVisual(meetingId, requestDto);
            return ResponseEntity.ok(ApiResponseDto.success("시각화 json 수정 성공"));
        }
        catch (Exception e) {
            log.error("시각화 업데이트 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponseDto.error("서버 오류로 인해 시각화 업데이트가 실패했습니다."));
        }
    }

    @GetMapping("/{meetingId}/summary/edit")
    public ResponseEntity<ApiResponseDto<Void>> checkSummaryEditPermission(@RequestHeader("X-User-Id") Long id, @PathVariable Long meetingId) {
        return meetingResultService.canEditResult(id, meetingId) ?
                ResponseEntity.ok(ApiResponseDto.success("마크다운 요약 수정 모드 전환 성공")) :
                ResponseEntity.status(403).body(ApiResponseDto.error("수정 권한이 없습니다."));
    }

    @PostMapping("/{meetingId}/summary/save")
    public ResponseEntity<ApiResponseDto<Void>> updateSummary(@RequestBody SummaryEditRequestDto requestDto, @PathVariable Long meetingId) {
        try {
            meetingResultService.updateSummary(meetingId, requestDto);
            return ResponseEntity.ok(ApiResponseDto.success("마크다운 요약 수정 성공"));
        } catch (Exception e) {
            log.error("마크다운 요약 업데이트 중 오류 발생", e);
            return ResponseEntity.status(500).body(ApiResponseDto.error("서버 오류로 인해 마크다운 요약 업데이트가 실패했습니다."));
        }
    }

    @GetMapping("/{meetingId}/participants")
    public ResponseEntity<ApiResponseDto<MeetingParticipantsResponseDto>> getParticipants(@PathVariable Long meetingId) {
        //회의 시각화 자료 조회 시 해당 회의의 참가자 목록 조회
        try {
            List<String> participants = meetingResultService.getParticipantsByMeetingId(meetingId);

            return ResponseEntity.ok(ApiResponseDto.success("해당 회의의 참가자 목록 전송 성공", MeetingParticipantsResponseDto.of(participants)));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(ApiResponseDto.error("해당 회의의 참가자 목록 전송 실패: " + e.getMessage()));
        }
    }
}