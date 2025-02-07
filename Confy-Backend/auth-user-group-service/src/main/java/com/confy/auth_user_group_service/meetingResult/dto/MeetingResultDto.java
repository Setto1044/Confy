package com.confy.auth_user_group_service.meetingResult.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingResultDto {
    private Long id;
    private String meetingNName;
    private String meetingUUID;
    private LocalDateTime startedAt;
    private Long groupId;
    private String textSummary;
    private String summaryImagePath;

    // have to add
    private String groupName;
    private boolean isFavorite;
}
