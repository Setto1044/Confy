package com.confy.sentence.repository;

import com.confy.sentence.dto.MeetingSentenceRequestDto;
import com.confy.sentence.dto.MeetingSentenceResponseDto;
import org.springframework.data.redis.connection.stream.RecordId;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.List;

public interface MeetingSentenceRepository {
    List<MeetingSentenceResponseDto> getAllMeetingContents(String meetingId);

    RecordId saveSentence(MeetingSentenceRequestDto dto);
}
