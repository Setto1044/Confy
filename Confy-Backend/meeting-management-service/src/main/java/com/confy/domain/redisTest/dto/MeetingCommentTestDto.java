package com.confy.domain.redisTest.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class MeetingCommentTestDto {
    private String meetingId;
    private String speaker;
    private String content;
    private String order;
    private ZonedDateTime timestamp; // 다양한 나라 시간대 고려
}
