package com.confy.auth_user_group_service.user.dto;

import com.confy.auth_user_group_service.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserOtherResponseDto {
    private Long id;
    private String email;
    private String fullName;
    private String profileUrl;


    public static UserOtherResponseDto of(User user) {
        return new UserOtherResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileUrl());
    }
}
