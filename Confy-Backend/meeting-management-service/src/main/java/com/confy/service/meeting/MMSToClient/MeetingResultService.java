package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToGPT.GptResponseDto;
import com.confy.vo.SentenceVo;

import java.util.List;

public interface MeetingResultService {
//    void saveScriptToMySQL(List<SentenceVo> script); // 지금은 sttService에서 처리
    void saveVisualizationToMySQL(GptResponseDto visualization);
    void saveSummaryToMySQL(GptResponseDto summary);
    void saveKeywordsToMySQL(GptResponseDto keywords);
}
