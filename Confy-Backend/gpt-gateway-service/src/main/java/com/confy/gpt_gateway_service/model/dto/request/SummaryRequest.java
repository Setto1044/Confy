package com.confy.gpt_gateway_service.model.dto.request;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SummaryRequest {
    private List<Map<String, Object>> script;
}
