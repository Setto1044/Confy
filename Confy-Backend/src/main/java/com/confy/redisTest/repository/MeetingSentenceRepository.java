package com.confy.redisTest.repository;

import com.confy.redisTest.dto.MeetingSentenceRequestDto;
import com.confy.redisTest.dto.MeetingSentenceResponseDto;
import org.springframework.data.redis.connection.stream.RecordId;

import java.util.List;

public interface MeetingSentenceRepository {
    List<MeetingSentenceResponseDto> getMeetingContents(String meetingId);
    RecordId saveSentence(String meetingId, MeetingSentenceRequestDto dto);
}
