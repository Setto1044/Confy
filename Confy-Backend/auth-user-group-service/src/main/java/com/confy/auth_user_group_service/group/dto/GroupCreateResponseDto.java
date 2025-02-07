package com.confy.auth_user_group_service.group.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class GroupCreateResponseDto {
    private Long id;
    private String groupName;
    private Long groupLeaderId;
    private LocalDateTime createdAt;
}
