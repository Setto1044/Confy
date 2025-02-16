package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingExitDto {
    private int onlineParticipants;

    public static MeetingExitDto of(int onlineParticipants) {
        return new MeetingExitDto(onlineParticipants);
    }
}
