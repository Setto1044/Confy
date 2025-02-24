package com.confy.dto.MMSToUGS;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingTimeResponseDto {
    private Long meetingId;
    private String meetingName;
    private String meetingUUID;
    private LocalDateTime startedAt;
    private Long groupId;

    /**
     * ✅ `Meeting` 엔티티로부터 DTO 생성 메서드
     */
    public static MeetingTimeResponseDto of(Long meetingId, String meetingName, String meetingUUID,
                                            LocalDateTime startedAt, Long groupId) {
        return new MeetingTimeResponseDto(meetingId, meetingName, meetingUUID, startedAt, groupId);
    }
}