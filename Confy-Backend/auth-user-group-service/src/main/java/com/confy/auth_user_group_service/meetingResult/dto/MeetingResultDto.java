package com.confy.auth_user_group_service.meetingResult.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingResultDto {
    private Long id;
    private String meetingName;
    private String meetingUUID;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Long groupId;
    private boolean isOnline;
    private String textSummary;
    private String summaryImagePath;

    // have to add
    private String groupName;
    private boolean isFavorite;
}
