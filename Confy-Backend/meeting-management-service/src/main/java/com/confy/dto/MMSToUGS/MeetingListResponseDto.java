package com.confy.dto.MMSToUGS;

import com.confy.entity.Meeting;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingListResponseDto {
    Long id;
    String meetingName;
    String meetingUUID;
    String startedAt;
    Long groupId;
    String textSummary;
    String summaryImagePath;

    public static MeetingListResponseDto of(Long id, String meetingName, String meetingUUID,
                                            String startedAt, Long groupId, String textSummary,
                                            String summaryImagePath) {
        return new MeetingListResponseDto(id, meetingName, meetingUUID, startedAt, groupId, textSummary, summaryImagePath);
    }
}
