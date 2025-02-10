package com.confy.gpt_gateway_service.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RealTimeResponse {
    private Long meetingId;         // 회의의 고유 ID
    private String summary;         // 회의 요약 결과
}