package com.confy.sentence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingSentenceResponseDto {
    private String meetingId;
    private String speaker;
    private String content;
    private ZonedDateTime timestamp;
}
