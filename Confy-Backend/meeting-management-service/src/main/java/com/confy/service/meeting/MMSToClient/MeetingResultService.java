package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.*;
import com.confy.dto.MMSToGPT.GptResponseDto;

import java.util.List;

public interface MeetingResultService {
    void processMeetingEnd(Long meetingId);
//    void saveScriptToMySQL(List<SentenceVo> script); // 지금은 sttService에서 처리
//    void saveVisualizationToMySQL(Mono<GptResponseDto> visualization);
    void saveSummaryToMySQL(GptResponseDto summary);
//    void saveKeywordsToMySQL(Mono<GptResponseDto> keywords);

    MeetingResultDto findMeetingResult(Long meetingId);
    ScriptResponseDto findScript(Long meetingId);
    VisualResponseDto findVisualJson(Long meetingId);
    TextSummaryResponseDto findTextSummary(Long meetingId);
    KeywordsResponseDto findKeywords(Long meetingId);

    boolean canEditResult(Long userId, Long meetingId);
    void updateVisual(Long meetingId, VisualEditRequestDto requestDto);
    void updateSummary(Long meetingId, SummaryEditRequestDto requestDto);

    List<String> getParticipantsByMeetingId(Long meetingId);
}
