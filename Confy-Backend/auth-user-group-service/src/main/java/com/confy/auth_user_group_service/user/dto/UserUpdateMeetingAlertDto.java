package com.confy.auth_user_group_service.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateMeetingAlertDto {
    private boolean isMeetingAlertOn;
}
