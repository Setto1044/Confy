package com.confy.auth_user_group_service.user.dto;

import com.confy.auth_user_group_service.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSelfResponseDto {
    private Long id;
    private String email;
    private String fullName;
    private String profileUrl;
    private boolean isMeetingAlertOn;
    private boolean isGroupAlertOn;
    private boolean isPushAlertOn;


    public static UserSelfResponseDto of(User user) {
        return new UserSelfResponseDto(user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getProfileUrl(),
                user.getIsMeetingAlertOn(),
                user.getIsGroupAlertOn(),
                user.getIsPushAlertOn());
    }
}
