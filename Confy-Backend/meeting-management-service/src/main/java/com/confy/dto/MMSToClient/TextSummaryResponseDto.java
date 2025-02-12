package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TextSummaryResponseDto {
    private String textSummary;

    public static TextSummaryResponseDto of(String textSummary) {
        return new TextSummaryResponseDto(textSummary);
    }
}
