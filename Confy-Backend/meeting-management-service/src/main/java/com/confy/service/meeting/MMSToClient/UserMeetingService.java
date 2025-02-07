package com.confy.service.meeting.MMSToClient;

import com.confy.entity.Meeting;
import com.confy.entity.UserMeeting;

import java.time.LocalDateTime;

public interface UserMeetingService {

    public UserMeeting saveUserMeeting(Meeting meeting, Long userId);

}
