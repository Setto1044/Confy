package com.confy.dto.MMSToClient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingCreateResponseDto {
    private String UUID;

    public static MeetingCreateResponseDto of(String uuid) {
        return new MeetingCreateResponseDto(uuid); // 기존 필드명을 유지하면서 `of` 사용
    }
}
