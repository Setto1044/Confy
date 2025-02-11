package com.confy.gpt_gateway_service.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealTimeRequestDto {
    private List<SentenceDto> script;
    private Long meetingId;

    public static RealTimeRequestDto of(List<SentenceDto> script, Long meetingId) {
        return new RealTimeRequestDto(script, meetingId);
    }
}
