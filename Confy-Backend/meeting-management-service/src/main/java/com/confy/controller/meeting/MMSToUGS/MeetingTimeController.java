package com.confy.controller.meeting.MMSToUGS;

import com.confy.dto.MMSToUGS.MeetingTimeResponseDto;
import com.confy.service.meeting.MMSToUGS.MeetingTimeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/meetings")
public class MeetingTimeController {

    private final MeetingTimeService meetingTimeService;

    /**
     * ✅ 특정 시간 후 시작할 미팅 리스트 조회
     *
     * @param minutes: 몇 분 후 시작할 미팅을 조회
     */
    @GetMapping(value = "/upcoming", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MeetingTimeResponseDto>> getUpcomingMeetings(@RequestParam("minutes") int minutes) {
        log.info("🔍 /api/meetings/upcoming 호출: {}분 후 회의 조회", minutes);
        try {
            List<MeetingTimeResponseDto> meetings = meetingTimeService.getMeetingsStartingInMinutes(minutes);
            log.info("✅ 조회된 미팅 수: {}", meetings.size());
            return ResponseEntity.ok(meetings);
        } catch (Exception e) {
            log.error("❌ 회의 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(null);
        }
    }

    /**
     * ✅ 현재 시점 이후의 모든 예정된 회의 조회
     */
    @GetMapping(value = "/scheduled", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getScheduledMeetings() {
        log.info("🔍 /api/meetings/scheduled 호출: 예약된 모든 미팅 조회");
        try {
            LocalDateTime now = LocalDateTime.now(); // 🟦 NEW: now 파라미터 추가
            List<MeetingTimeResponseDto> meetings = meetingTimeService.getScheduledMeetings(now); // 🟦 NEW: getScheduledMeetings 호출
            log.info("✅ 조회된 예약 미팅 수: {}", meetings.size());
            return ResponseEntity.ok(meetings);
        } catch (Exception e) {
            log.error("❌ 예약 미팅 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "요청 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
                    "error", e.getMessage()
            ));
        }
    }
}
