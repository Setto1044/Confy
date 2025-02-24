package com.confy.auth_user_group_service.user.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserUpdateProfileImgResponseDto {
    private String profileUrl;

    private UserUpdateProfileImgResponseDto(String profileUrl) {
        this.profileUrl = profileUrl;
    }

    public static UserUpdateProfileImgResponseDto of(String profileUrl) {
        return new UserUpdateProfileImgResponseDto(profileUrl);
    }
}
