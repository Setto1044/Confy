package com.confy.auth_user_group_service.group.dto;

import com.confy.auth_user_group_service.group.entity.UserGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class GroupInviteResponseDto {
    private List<UserGroupDto> groupMembers;

    private GroupInviteResponseDto(List<UserGroupDto> groupMembers) {
        this.groupMembers = groupMembers;
    }

    public static GroupInviteResponseDto of(List<UserGroupDto> userGroups) {
        return new GroupInviteResponseDto(userGroups);
    }
}
