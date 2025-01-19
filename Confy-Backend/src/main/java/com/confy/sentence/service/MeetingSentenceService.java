package com.confy.sentence.service;

import com.confy.sentence.dto.MeetingSentenceRequestDto;
import com.confy.sentence.dto.MeetingSentenceResponseDto;
import org.springframework.data.redis.connection.stream.RecordId;

import java.util.List;

public interface MeetingSentenceService {
    String saveSentence(MeetingSentenceRequestDto dto);

    List<MeetingSentenceResponseDto> getAllMeetingContents(String meetingId);
}
