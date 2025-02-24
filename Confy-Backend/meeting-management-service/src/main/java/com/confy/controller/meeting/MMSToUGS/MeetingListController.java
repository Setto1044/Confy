package com.confy.controller.meeting.MMSToUGS;

import com.confy.common.responseDto.ApiResponseDto;
import com.confy.dto.MMSToUGS.MeetingListResponseDto;
import com.confy.entity.Meeting;
import com.confy.service.meeting.MMSToUGS.MeetingListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/api/meetings")
public class MeetingListController {

    private final MeetingListService meetingListService;

    /*
    * 회의 목록을 조회하는 엔드포인트
    * @param type 조회할 회의 유형 (예: "all")
    * @param groupIds 조회할 그룹 ID 목록
    * @param cursor 페이징을 위한 기준 ID (이 ID 이후의 데이터 조회). 없으면 처음 조회하는 요청으로 간주
    * @param size 한 번에 가져올 회의 개수
    * @return ApiResponseDto 형태로 회의 목록 반환
    * http://localhost:6080/meetings/list?type=all&group-id=1, 2, 3&cursor={id}&size={N}
    * http://localhost:6080/meetings/list?type=all&group-id=1, 2, 3&size={N}
    * http://localhost:6080/meetings/list?type=group&group-id=3&cursor={id}&size={N}
    * */
    @GetMapping("/list")
    public ResponseEntity<Map<String, List<MeetingListResponseDto>>> getMeetings(
            @RequestParam("type") String type,
            @RequestParam("group-id") List<Long> groupIds,
            @RequestParam(value = "cursor", required = false) Long cursor,
            @RequestParam("size") int size) {
        log.info("getMeetings called by UserGroup Server");
        try {
            // 서비스 계층에서 미팅 목록을 조회
            List<Meeting> meetings = meetingListService.getMeetings(type, groupIds, cursor, size);

            // 응답 형식에 맞게 변환 (Summary 포함)
            List<MeetingListResponseDto> meetingDtos = meetings.stream()
                    .map(meeting -> {
                        String textSummary = meeting.getSummaries().isEmpty() ? null : meeting.getSummaries().get(0).getTextSummary();
                        String summaryImagePath = meeting.getSummaries().isEmpty() ? null : meeting.getSummaries().get(0).getSummaryImagePath();
                        return MeetingListResponseDto.of(
                                meeting.getMeetingId(),
                                meeting.getMeetingName(),
                                meeting.getMeetingUuid(),
                                meeting.getStartedAt().toString(),
                                meeting.getGroupId(),
                                textSummary,
                                summaryImagePath
                        );
                    })
                    .collect(Collectors.toList());

            // "meetings" 키로 데이터를 감싸서 반환
            Map<String, List<MeetingListResponseDto>> response = new HashMap<>();
            response.put("meetings", meetingDtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("회의 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
