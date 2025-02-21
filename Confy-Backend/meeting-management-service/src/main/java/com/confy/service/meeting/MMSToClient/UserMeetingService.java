package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.MeetingExitDto;
import com.confy.entity.Meeting;
import com.confy.entity.UserMeeting;

import java.time.LocalDateTime;
import java.util.List;

public interface UserMeetingService {

    UserMeeting saveUserMeeting(Meeting meeting, Long userId);
    MeetingExitDto exitMeeting(Long meetingId, Long userId);
    List<String> getSpeakersByMeetingId(Long meetingId);

}
