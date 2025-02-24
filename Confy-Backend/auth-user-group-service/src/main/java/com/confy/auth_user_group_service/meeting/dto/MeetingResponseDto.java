package com.confy.auth_user_group_service.meeting.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class MeetingResponseDto {
    private Long meetingId;
    private Long groupId;
    private String meetingName;
    private String groupName;
    private LocalDateTime startedAt;

    @Override
    public String toString() {
        return String.format("MeetingResponseDto(meetingId=%d, groupId=%d, groupName=%s, meetingName=%s, startedAt=%s)",
                meetingId, groupId, groupName, meetingName, startedAt);
    }

}
