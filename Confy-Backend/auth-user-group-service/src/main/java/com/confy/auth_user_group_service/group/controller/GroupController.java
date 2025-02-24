package com.confy.auth_user_group_service.group.controller;

import com.confy.auth_user_group_service.common.responseDto.ApiResponseDto;
import com.confy.auth_user_group_service.group.dto.*;
import com.confy.auth_user_group_service.group.entity.UserGroup;
import com.confy.auth_user_group_service.group.service.GroupService;
import com.confy.auth_user_group_service.group.service.UserGroupService;
import com.confy.auth_user_group_service.user.dto.UserOtherResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final UserGroupService userGroupService;

    /**
     * 사용자가 속한 전체 그룹 조회
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponseDto<GroupsResponseDto>> getAllGroups(
            @RequestHeader("X-User-Id") Long userId) {
        List<UserGroup> userGroups = userGroupService.getJoinedGroupsForUser(userId);
        // 사용자가 참여한 groupId에 해당하는 User-Group 들을 스트림으로 조회
        List<GroupDto> groupDtos = userGroups.stream()
                .map(userGroup -> groupService.getGroupDtoById(userGroup.getGroup().getId()))
                .collect(Collectors.toList());

        GroupsResponseDto responseDto = GroupsResponseDto.of(groupDtos);
        log.info(">> {} groups found for user({})", responseDto.getGroups().size(), userId);
        return ResponseEntity.ok(ApiResponseDto.success("회원 그룹 조회 성공", responseDto));
    }

    /**
     * 새 그룹 생성
     */
    @PostMapping("/new")
    public ResponseEntity<ApiResponseDto<GroupDto>> createGroup(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody GroupCreateRequestDto requestDto) {
        GroupDto createdGroup = groupService.createGroup(userId, requestDto.getGroupName());
        log.info(">> group ({}) created by user ({})", createdGroup.getId(), userId);
        return ResponseEntity.ok(ApiResponseDto.success("새 그룹 생성 성공", createdGroup));
    }

    /**
     * 특정 그룹에 속한 멤버 전체 조회
     * 그룹 서비스도 이용 가능
     */
    @GetMapping("/members/{groupId}")
    public ResponseEntity<ApiResponseDto<GroupMembersDto>> getGroupMembers(@PathVariable Long groupId) {
        List<UserOtherResponseDto> users = userGroupService.getUsersInGroup(groupId);
        log.info(">> ({}) users are joined at group ({})", users.size(), groupId);
        return ResponseEntity.ok(ApiResponseDto.success("그룹 멤버 조회 성공", new GroupMembersDto(users)));
    }

    /**
     * 그룹 이름 변경
     */
    @PatchMapping("/{groupId}")
    public ResponseEntity<ApiResponseDto<Void>> updateGroupName(
            @PathVariable Long groupId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody GroupNameUpdateRequestDto requestDto) {
        groupService.updateGroupName(groupId, userId, requestDto.getGroupName());
        log.info(">> group ({}) updated by user ({})", groupId, userId);
        return ResponseEntity.ok(ApiResponseDto.success("그룹 이름 변경 성공"));
    }

    /**
     * 그룹 삭제 (소프트 삭제)
     */
    @PostMapping("/left/{groupId}")
    public ResponseEntity<ApiResponseDto<Void>> deleteGroup(
            @PathVariable Long groupId,
            @RequestHeader("X-User-Id") Long userId) {
        //groupService.deleteGroup(groupId, userId);
        userGroupService.leaveGroup(userId, groupId);
        return ResponseEntity.ok(ApiResponseDto.success("그룹 삭제 성공"));
    }

    @PostMapping("/invite/{groupId}")
    public ResponseEntity<ApiResponseDto<GroupInviteResponseDto>> inviteGroup(
            @PathVariable Long groupId,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody GroupInviteRequestDto requestDto) {

        return ResponseEntity.ok(ApiResponseDto
                .success("그룹 초대에 성공했습니다.",
                        GroupInviteResponseDto.of(userGroupService.addUsersToGroup(userId, groupId, requestDto))));

    }
}
