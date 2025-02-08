package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingCreateRequestDto {

    String meetingName;
    String startedAt;
    String groupId;
    String visualType;
}
