package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingParticipantsResponseDto {
    private List<String> participants;

    public static MeetingParticipantsResponseDto of(List<String> participants) {
        return new MeetingParticipantsResponseDto(participants);
    }
}

