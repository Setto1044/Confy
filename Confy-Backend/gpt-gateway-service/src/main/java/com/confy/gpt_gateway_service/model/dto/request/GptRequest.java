package com.confy.gpt_gateway_service.model.dto.request;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class GptRequest {
    private Long meetingPk;
    private List<Map<String, Object>> script;

    // 실시간 요약 요청 시에만 사용
    private Integer startTime;
    private Integer endTime;
}
