package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingScriptResponseDto {
    private List<SentenceDto> script;
    public static MeetingScriptResponseDto of(List<SentenceDto> script) {
        return new MeetingScriptResponseDto(script);
    }
}
