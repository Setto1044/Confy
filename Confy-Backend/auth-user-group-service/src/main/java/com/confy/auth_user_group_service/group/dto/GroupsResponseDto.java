package com.confy.auth_user_group_service.group.dto;

import com.confy.auth_user_group_service.group.entity.UserGroup;
import lombok.Data;

import java.util.List;

@Data
public class GroupsResponseDto {
    private List<GroupDto> groups;

    private GroupsResponseDto(List<GroupDto> groups) {
        this.groups = groups;
    }

    public static GroupsResponseDto of(List<GroupDto> groups) {
        return new GroupsResponseDto(groups);
    }
}
