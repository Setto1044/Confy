package com.confy.auth_user_group_service.group.dto;

import com.confy.auth_user_group_service.group.entity.UserGroup;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class UserGroupDto {
    private Long id;
    private Long userId;
    private Long groupId;
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;

    private UserGroupDto(UserGroup userGroup) {
        this.id = userGroup.getId();
        this.userId = userGroup.getUser().getId();
        this.groupId = userGroup.getGroup().getId();
        this.joinedAt = userGroup.getJoinedAt();
        this.leftAt = userGroup.getLeftAt();
    }

    public static UserGroupDto of(UserGroup userGroup) {
        return new UserGroupDto(userGroup);
    }
}