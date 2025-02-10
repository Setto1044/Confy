package com.confy.service.stt;

import com.confy.dto.MMSToClient.MeetingScriptResponseDto;

public interface SttService {
    void saveSttDataToDatabase(Long meetingId);

    MeetingScriptResponseDto getScript(Long meetingId);
}
