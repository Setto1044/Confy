package com.confy.auth_user_group_service.group.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupInviteRequestDto {
    private List<String> userEmails;
}
