package com.confy.service.meeting.MMSToGPT;
import com.confy.dto.MMSToGPT.GptRequestDto;
import com.confy.dto.MMSToGPT.GptResponseDto;
import com.confy.dto.MMSToGPT.RealTimeRequestDto;
import com.confy.dto.MMSToGPT.RealTimeResponseDto;
import reactor.core.publisher.Mono;

public interface GptService {

    // 실시간 요청 처리
    public Mono<RealTimeResponseDto> requestRealTimeSummary(RealTimeRequestDto requestDto, Long userId, Long meetingId);

    // 회의 종료 후 요약 요청
    public Mono<GptResponseDto> requestProcessFromGpt(GptRequestDto requestDto);

}
