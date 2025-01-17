package com.confy.redisTest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingSentenceResponseDto {
    private String meetingId;
    private String speakerName;
    private String content;
    private Integer sequence;
    private ZonedDateTime timestamp;
}
