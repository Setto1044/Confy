package com.confy.auth_user_group_service.meetingResult.service;

import com.confy.auth_user_group_service.group.service.GroupService;
import com.confy.auth_user_group_service.group.service.UserGroupService;
import com.confy.auth_user_group_service.meetingResult.dto.MeetingResultDto;
import com.confy.auth_user_group_service.meetingResult.dto.MeetingResultListDto;
import com.confy.auth_user_group_service.meetingResult.enums.MeetingResultType;
import com.confy.auth_user_group_service.meetingResult.webClient.MeetingInfoWebClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MeetingResultServiceImpl implements MeetingResultService {
    private final UserGroupService userGroupService;
    private final GroupService groupService;
    private final MeetingInfoWebClient meetingInfoWebClient;

    @Override
    public MeetingResultListDto getMeetingsByType(Long userId, MeetingResultType type, Long groupId, Long cursor, int size) {
        // type이 
        // group이면 쿼리 파라미터에서 받아오기
        // group이 아니면 사용자가 속한 Group Id 리스트를 가져와 Meeting 서비스세서 사용할 수 있도록
        List<Long> groupIds;
        groupIds = Optional.ofNullable(userGroupService.getGroupIdsForUser(userId))
                .orElse(Collections.emptyList()); // null 방지

        // 그룹에 속하지 않았다면 조회하지 않기
        if (type == MeetingResultType.GROUP && groupId != null && !groupIds.contains(groupId)) {
            throw new IllegalArgumentException("그룹에 속하지 않아 회의 접근 권한이 없습니다.");
        }

        // 소속된 그룹이 없다면 빈 리스트 제공
        if (groupIds.isEmpty()) {
            return MeetingResultListDto.of(Collections.emptyList());
        }
        log.info(">> groupIds: {}", groupIds.toString());
        try {
            List<MeetingResultDto> meetingResults = Optional.ofNullable(meetingInfoWebClient
                            .getMeetingList(userId, type, groupIds, cursor, size)
                            .block()) // WebClient 응답이 null일 가능성 처리
                    .orElse(Collections.emptyList());
            if (meetingResults.isEmpty()) {
                log.warn(">> No meetings found for user id {} and type {}", userId, type);
            }

            // meetingList 그룹 정보 채우기
            for(MeetingResultDto meetingResult : meetingResults) {
                meetingResult.setGroupName(groupService.getGroupById(meetingResult.getGroupId()).getGroupName());
                meetingResult.setFavorite(meetingResult.isFavorite());
            }

            return MeetingResultListDto.of(meetingResults);
        } catch (Exception e) {
            log.error(">> 회의 조회 중 문제 발생: {}", e.getMessage());
            throw new RuntimeException("회의 결과 조회 중 문제가 발생했습니다.");
        }
    }
}
