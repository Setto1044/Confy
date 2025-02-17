package com.confy.service.meeting.MMSToUGS;

import com.confy.dto.MMSToUGS.MeetingTimeResponseDto;
import com.confy.entity.Meeting;

import java.util.List;

public interface MeetingListService {

    public List<Meeting> getMeetings(String type, List<Long> groupIds, Long cursor, int size);
}
