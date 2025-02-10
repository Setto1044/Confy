package com.confy.dto.MMSToGPT;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GptRequestDto {
    private Long meetingPk;
    private List<Map<String, Object>> script;
    private Integer startTime;
    private Integer endTime;
}