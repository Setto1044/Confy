package com.confy.service.redis;

import com.confy.vo.SentenceVo;

import java.util.List;

public interface RedisService {
    // 한 회의에 대한 전체 스크립트 조회
    List<SentenceVo> getScript(Long meetingId);

    // 한 회의에 대한 특정 시간대의 스크립트 조회
    List<SentenceVo> getSentencesByTime(Long meetingId, String start, String end);

    // 회의 데이터 저장
    void addSentence(Long meetingId, SentenceVo sentenceVo);
}
