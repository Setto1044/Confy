package com.confy.auth_user_group_service.group.service;

import com.confy.auth_user_group_service.group.dto.GroupDto;
import com.confy.auth_user_group_service.group.entity.Group;

public interface GroupService {

    /**
     * 그룹을 생성합니다.
     */
    GroupDto createGroup(Long userId, String groupName);

    /**
     * 그룹을 삭제합니다. (soft delete)
     */
    void deleteGroup(Long userId, Long groupId);

    /**
     * 활성화된 특정 그룹 정보를 조회합니다. for controller
     */
    GroupDto getGroupDtoById(Long groupId);

    /**
     * 활성화된 특정 그룹 정보를 조회합니다. for Service
     */
    Group getGroupById(Long groupId);

    /**
     * 그룹 이름을 변경합니다. (그룹장만 가능)
     */
    void updateGroupName(Long groupId, Long userId, String newGroupName);
}
