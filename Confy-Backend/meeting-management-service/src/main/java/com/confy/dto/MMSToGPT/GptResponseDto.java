package com.confy.dto.MMSToGPT;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GptResponseDto {
    private Long meetingPk;
    private String summary;
    private String visualization;
    private String keywords;
}