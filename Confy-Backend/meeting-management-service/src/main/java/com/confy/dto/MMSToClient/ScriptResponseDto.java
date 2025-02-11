package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScriptResponseDto {
    private List<SentenceDto> script;

    public static ScriptResponseDto of(List<SentenceDto> sentences) {
        return new ScriptResponseDto(sentences);
    }
}
