package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KeywordsResponseDto {
    private List<String> keywords;

    public static KeywordsResponseDto of(List<String> keywords) {
        return new KeywordsResponseDto(keywords);
    }
}
