package com.confy.auth_user_group_service.group.dto;

import com.confy.auth_user_group_service.group.entity.UserGroup;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMembersDto {
    private List<UserGroupDto> members;
}
