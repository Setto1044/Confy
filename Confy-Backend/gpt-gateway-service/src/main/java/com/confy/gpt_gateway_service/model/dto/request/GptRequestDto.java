package com.confy.gpt_gateway_service.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GptRequestDto {
    private Long meetingId;
    private List<SentenceDto> script;

    public static GptRequestDto of(Long meetingId, List<SentenceDto> script) {
        return new GptRequestDto(meetingId, script);
    }
}
