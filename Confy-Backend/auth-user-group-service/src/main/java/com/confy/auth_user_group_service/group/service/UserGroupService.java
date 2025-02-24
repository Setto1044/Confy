package com.confy.auth_user_group_service.group.service;

import com.confy.auth_user_group_service.group.dto.GroupInviteRequestDto;
import com.confy.auth_user_group_service.group.dto.UserGroupDto;
import com.confy.auth_user_group_service.group.entity.UserGroup;
import com.confy.auth_user_group_service.user.dto.UserOtherResponseDto;

import java.util.List;

public interface UserGroupService {

    // 특정 그룹에 속한 유저 리스트 조회
    List<UserOtherResponseDto> getUsersInGroup(Long groupId);

    // 특정 유저가 속한 그룹 리스트 조회
    List<UserGroup> getJoinedGroupsForUser(Long userId);

    // 특정 유저가 속한 그룹 ID 리스트 조화
    List<Long> getGroupIdsForUser(Long userId);

    // 유저가 특정 그룹에 속해 있는지 확인
    boolean isUserInGroup(Long userId, Long groupId);

    // 그룹에 Email List Dto의 회원들 추가
    List<UserGroupDto> addUsersToGroup(Long userId, Long groupId, GroupInviteRequestDto requestDto);

    // 그룹 나가기
    void leaveGroup(Long userId, Long groupId);
}
