package com.confy.auth_user_group_service.user.dto;

import lombok.Setter;

@Setter
public class UserUpdateProfileImgResponseDto {
    private String profileUrl;

    private UserUpdateProfileImgResponseDto(String profileUrl) {
        this.profileUrl = profileUrl;
    }

    public static UserUpdateProfileImgResponseDto of(String profileUrl) {
        return new UserUpdateProfileImgResponseDto(profileUrl);
    }
}
