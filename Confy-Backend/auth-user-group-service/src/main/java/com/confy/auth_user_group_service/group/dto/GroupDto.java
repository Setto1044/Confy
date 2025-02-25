package com.confy.auth_user_group_service.group.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class GroupDto {
    private Long id;
    private String groupName;
    private Long groupLeaderId;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    private GroupDto(Long id, String groupName, Long groupLeaderId, LocalDateTime createdAt, LocalDateTime deletedAt) {
        this.id = id;
        this.groupName = groupName;
        this.groupLeaderId = groupLeaderId;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }

    public static GroupDto of(Long id, String groupName, Long groupLeaderId, LocalDateTime createdAt, LocalDateTime deletedAt) {
        return new GroupDto(id, groupName, groupLeaderId, createdAt, deletedAt);
    }
}
