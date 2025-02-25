package com.confy.dto.MMSToUGS;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

@Getter
@NoArgsConstructor  // JSON 역직렬화를 위해 기본 생성자 추가
public class GroupMembersDto {
    private List<UserGroupDto> members;

    @JsonCreator
    public GroupMembersDto(@JsonProperty("members") List<UserGroupDto> members) {
        this.members = (members != null) ? members : Collections.emptyList(); // null 방지
    }
}
