package com.confy.dto.MMSToGPT;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RealTimeResponseDto {
    private Long meetingPk;
    private String summary;
}