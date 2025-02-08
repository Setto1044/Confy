package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.MeetingCreateRequestDto;
import com.confy.entity.Meeting;
import com.confy.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

public interface MeetingService {

    void saveMeeting(Meeting meeting);

    Meeting generateUUID(Long id, MeetingCreateRequestDto dto);
}
