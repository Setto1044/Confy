package com.confy.auth_user_group_service.user.dto;

import lombok.Data;

@Data
public class UserLoginResponseDto {
    private String token;

    private UserLoginResponseDto(String token) {
        this.token = token;
    }

    public static UserLoginResponseDto of(String token) {
        return new UserLoginResponseDto(token);
    }
}
