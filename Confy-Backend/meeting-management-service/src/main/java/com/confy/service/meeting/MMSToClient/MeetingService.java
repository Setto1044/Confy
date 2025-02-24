package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.MeetingCreateRequestDto;
import com.confy.dto.MMSToClient.MeetingScriptResponseDto;
import com.confy.entity.Meeting;

public interface MeetingService {

    void saveMeeting(Meeting meeting, String visualType);

    Meeting generateUUID(Long id, MeetingCreateRequestDto dto);

    boolean finishMeeting(Long meetingId, String meetingUuid, Long userId);

    MeetingScriptResponseDto getMeetingScript(Long userId, Long meetingId);
}
