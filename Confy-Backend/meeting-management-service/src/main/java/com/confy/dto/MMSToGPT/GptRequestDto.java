package com.confy.dto.MMSToGPT;

import com.confy.dto.MMSToClient.SentenceDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GptRequestDto {
    private Long meetingId;
    private List<SentenceDto> script;
}