package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MeetingResultDto {
    private int meetingId;
    private ScriptResponseDto script;
    private VisualResponseDto visual;
    private TextSummaryResponseDto text;
    private KeywordsResponseDto keywords;
}
