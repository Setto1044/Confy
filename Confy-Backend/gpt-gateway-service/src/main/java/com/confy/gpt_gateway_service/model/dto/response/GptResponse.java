package com.confy.gpt_gateway_service.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GptResponse {
    private Long meetingId;         // 회의의 고유 ID
    private String summary;         // 회의 요약 결과
    private String visualization;   // 시각화 데이터 (JSON 형식)
    private String keywords;        // 키워드 추출 결과
}