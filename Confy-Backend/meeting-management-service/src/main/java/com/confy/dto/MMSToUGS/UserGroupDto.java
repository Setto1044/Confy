package com.confy.dto.MMSToUGS;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserGroupDto {
    private Long id;
    private String email;
    private String fullName;
    private String profileUrl;

    @JsonCreator
    public UserGroupDto(
            @JsonProperty("id") Long id,
            @JsonProperty("email") String email,
            @JsonProperty("fullName") String fullName,
            @JsonProperty("profileUrl") String profileUrl) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.profileUrl = profileUrl;
    }
}
