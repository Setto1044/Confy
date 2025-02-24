package com.confy.auth_user_group_service.meetingResult.controller;

import com.confy.auth_user_group_service.common.responseDto.ApiResponseDto;
import com.confy.auth_user_group_service.group.entity.UserGroup;
import com.confy.auth_user_group_service.group.service.UserGroupService;
import com.confy.auth_user_group_service.meetingResult.enums.MeetingResultType;
import com.confy.auth_user_group_service.meetingResult.dto.MeetingResultListDto;
import com.confy.auth_user_group_service.meetingResult.service.MeetingResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/results")
public class MeetingResultController {
    private final MeetingResultService meetingResultService;

    @GetMapping
    public ResponseEntity<ApiResponseDto<MeetingResultListDto>> getMeetingResult(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam("type") String typeParam,
            @RequestParam(value = "group-id", required = false) Long groupId,
            @RequestParam(value = "cursor", required = false) Long cursor,
            @RequestParam("size") int size) {
        MeetingResultType type = MeetingResultType.fromValue(typeParam);

        MeetingResultListDto responseDto = meetingResultService.getMeetingsByType(userId, type, groupId, cursor, size);
        return ResponseEntity.ok(ApiResponseDto.success("조회 성공", responseDto));
    }

}
