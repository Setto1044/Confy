package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisualResponseDto {
    private String visualJson;

    public static VisualResponseDto of(String visualJson) {
        return new VisualResponseDto(visualJson);
    }
}
