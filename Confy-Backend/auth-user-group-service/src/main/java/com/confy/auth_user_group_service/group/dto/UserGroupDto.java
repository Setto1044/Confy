package com.confy.auth_user_group_service.group.dto;

import com.confy.auth_user_group_service.user.entity.User;
import lombok.Getter;

@Getter
public class UserGroupDto {
    private Long userId;
    private String userEmail;
    private final String userFullName;

    public UserGroupDto(User user) {
        this.userId = user.getId();
        this.userEmail = user.getEmail();
        this.userFullName = user.getFullName();
    }
}