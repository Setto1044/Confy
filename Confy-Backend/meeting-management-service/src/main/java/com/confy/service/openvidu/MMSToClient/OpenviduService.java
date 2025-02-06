package com.confy.service.openvidu.MMSToClient;

import com.confy.entity.Meeting;

public interface OpenviduService {

    public Meeting processMeetingEntry(String meetingUuid, Long userId);
}
