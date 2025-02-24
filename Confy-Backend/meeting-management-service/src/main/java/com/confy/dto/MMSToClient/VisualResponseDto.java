package com.confy.dto.MMSToClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VisualResponseDto {
    private String visualJson;

    // JSON 문자열을 파싱해서 VisualResponseDto를 생성하는 팩토리 메서드
    public static VisualResponseDto of(String visualJsonString) {
//        ObjectMapper mapper = new ObjectMapper();
//        try {
//            JsonNode jsonNode = mapper.readTree(visualJsonString);
//            return new VisualResponseDto(jsonNode);
//        } catch (Exception e) {
//            // 파싱 실패 시 빈 객체를 반환하거나 적절히 처리
//            return new VisualResponseDto(mapper.createObjectNode());
//        }
        return new VisualResponseDto(visualJsonString);
    }
}
