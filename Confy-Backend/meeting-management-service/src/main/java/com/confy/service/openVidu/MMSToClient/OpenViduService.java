package com.confy.service.openVidu.MMSToClient;

import com.confy.entity.Meeting;

public interface OpenViduService {

    public Meeting validateAndEnterMeeting(String meetingUuid, Long userId);
}
