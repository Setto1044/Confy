package com.confy.auth_user_group_service.meetingResult.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class MeetingListApiResponseDto {
    private List<MeetingInfoDto> meetings;
}
