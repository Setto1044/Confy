package com.confy.redisTest.dto;

import lombok.Data;

import java.time.ZonedDateTime;

@Data
public class MeetingCommentDto {
    private String meetingId;
    private String order;
    private String speaker;
    private String content;
    private ZonedDateTime timestamp; // 다양한 나라 시간대 고려
}
