package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingSpeakersResponseDto {
    private List<String> speakers;

    public static MeetingSpeakersResponseDto of(List<String> speakers) {
        return new MeetingSpeakersResponseDto(speakers);
    }
}

