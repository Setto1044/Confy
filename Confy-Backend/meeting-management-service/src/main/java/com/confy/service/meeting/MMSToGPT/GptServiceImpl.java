package com.confy.service.meeting.MMSToGPT;
import com.confy.dto.MMSToClient.MeetingScriptResponseDto;
import com.confy.dto.MMSToGPT.GptRequestDto;
import com.confy.dto.MMSToGPT.GptResponseDto;
import com.confy.dto.MMSToGPT.RealTimeRequestDto;
import com.confy.dto.MMSToGPT.RealTimeResponseDto;
import com.confy.dto.MMSToUGS.GroupMembersDto;
import com.confy.entity.Meeting;
import com.confy.repository.MeetingRepository;
import com.confy.service.meeting.MMSToUGS.GroupMembersService;
import com.confy.service.stt.SttService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class GptServiceImpl implements GptService {

    private final WebClient.Builder webClientBuilder;
    private final MeetingRepository meetingRepository;
    private final GroupMembersService groupMembersService;
    private final @Lazy SttService sttService;

    @Value("${services.gpt-gateway-service.uri}")
    private String gptGatewayUrl;

    // 실시간 요청 처리
    public Mono<RealTimeResponseDto> requestRealTimeSummary(RealTimeRequestDto requestDto, Long userId, Long meetingId) {

        //1. 회의 존재 여부 확인
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("해당 회의는 존재하지 않습니다. meetingId=" + meetingId));

        //2. 사용자가 해당 회의의 멤버인지 확인
        Long groupId = meeting.getGroupId();
        GroupMembersDto groupMembers = groupMembersService.getGroupMembers(groupId).block();
        if (groupMembers == null || groupMembers.getMembers().stream().noneMatch(user -> user.getId().equals(userId))) {
            throw new IllegalArgumentException("해당 사용자는 이 회의의 멤버가 아닙니다. userId=" + userId + ", group ID=" + groupId);
        }

        //Redis에서 현재 시간으로 부터 (startTime 전 ~ endTime 전)까지를 조회해오기
        MeetingScriptResponseDto script = sttService.getScript(meetingId, requestDto.getStartTime(), requestDto.getEndTime());

        //System.out.println(script.getScript());
        //return null;
        return webClientBuilder.build()
                .post()
                .uri(gptGatewayUrl + "/gpt/" + meetingId + "/real-time-summary")
                .bodyValue(script)
                .retrieve()
                .bodyToMono(RealTimeResponseDto.class);
    }

    // 회의 종료 후 요약 요청
    public Mono<GptResponseDto> requestProcessFromGpt(GptRequestDto requestDto) {
        return webClientBuilder.build()
                .post()
                .uri(gptGatewayUrl + "/gpt/" + requestDto.getMeetingId() + "/process")
                .bodyValue(requestDto)
                .retrieve()
                .bodyToMono(GptResponseDto.class);
    }
}
