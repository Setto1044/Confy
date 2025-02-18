package com.confy.service.meeting.MMSToUGS;

import com.confy.dto.MMSToUGS.MeetingTimeResponseDto;
import java.util.List;

public interface MeetingTimeService {

    /**
     * ✅ 특정 시간 후 시작할 미팅 리스트 조회
     */
    List<MeetingTimeResponseDto> getMeetingsStartingInMinutes(int minutes);

    List<MeetingTimeResponseDto> getAllScheduledMeetings();
}
