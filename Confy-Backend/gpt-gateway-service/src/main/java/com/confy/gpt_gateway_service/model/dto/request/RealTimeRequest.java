package com.confy.gpt_gateway_service.model.dto.request;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class RealTimeRequest {
    private Long meetingPk;
    private List<Map<String, Object>> script;

    private Integer startTime;
    private Integer endTime;
}
