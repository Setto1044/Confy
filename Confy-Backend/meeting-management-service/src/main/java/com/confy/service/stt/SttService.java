package com.confy.service.stt;

import com.confy.dto.MMSToClient.MeetingScriptResponseDto;

import java.time.LocalDateTime;

public interface SttService {
    void saveSttDataToDatabase(Long meetingId);

    MeetingScriptResponseDto getScript(Long meetingId, Long startTime, Long endTime);
}
