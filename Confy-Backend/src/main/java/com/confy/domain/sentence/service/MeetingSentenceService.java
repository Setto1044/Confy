package com.confy.domain.sentence.service;

import com.confy.domain.sentence.dto.MeetingSentenceRequestDto;
import com.confy.domain.sentence.dto.MeetingSentenceResponseDto;

import java.util.List;

public interface MeetingSentenceService {
    String saveSentence(MeetingSentenceRequestDto dto);

    List<MeetingSentenceResponseDto> getAllMeetingContents(String meetingId);

    List<MeetingSentenceResponseDto> getMeetingContentsByTime(String meetingId, int from, int to);
}
