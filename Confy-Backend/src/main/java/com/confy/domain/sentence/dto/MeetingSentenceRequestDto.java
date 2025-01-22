package com.confy.domain.sentence.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingSentenceRequestDto {
    private String meetingId;
    private String speaker;
    private String content;
}
