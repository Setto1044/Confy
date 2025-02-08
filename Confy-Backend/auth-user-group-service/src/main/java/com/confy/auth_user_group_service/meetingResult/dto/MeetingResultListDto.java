package com.confy.auth_user_group_service.meetingResult.dto;

import lombok.Data;

import java.util.List;

@Data
public class MeetingResultListDto {
    private List<MeetingResultDto> meetings;

    private MeetingResultListDto(List<MeetingResultDto> meetings) {
        this.meetings = meetings;
    }

    public static MeetingResultListDto of(List<MeetingResultDto> meetings) {
        return new MeetingResultListDto(meetings);
    }
}
