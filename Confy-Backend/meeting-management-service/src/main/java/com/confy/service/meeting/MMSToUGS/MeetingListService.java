package com.confy.service.meeting.MMSToUGS;

import com.confy.dto.MMSToClient.MeetingCreateRequestDto;
import com.confy.entity.Meeting;
import com.confy.repository.MeetingRepository;

import java.util.List;

public interface MeetingListService {

    public List<Meeting> getMeetings(String type, List<Long> groupIds, Long cursor, int size);
}
