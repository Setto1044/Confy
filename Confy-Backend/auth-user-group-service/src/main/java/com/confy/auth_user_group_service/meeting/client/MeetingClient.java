package com.confy.auth_user_group_service.meeting.client;

import com.confy.auth_user_group_service.meeting.dto.MeetingResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingClient {
    private final WebClient webClient;

    @Value("${meetingservice.uri.base}")
    private String meetingServiceUri;

    @Value("${meetingservice.uri.request.upcoming}")
    private String requestUpcomingUri;

    @Value("${meetingservice.uri.request.scheduled}")
    private String requestScheduledUri;

    /**
     * ✅ 특정 시간 후 시작하는 미팅 리스트 조회
     * @param minutes: 미팅 시작 시간 기준으로 몇 분 후인지
     * @return List<MeetingResponseDto>: 미팅 리스트 반환
     */
    public Mono<List<MeetingResponseDto>> getMeetingsStartingInMinutes(int minutes) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.plusMinutes(minutes - 2);
        LocalDateTime end = now.plusMinutes(minutes + 2);

        String uri = String.format("%s%s?start=%s&end=%s", meetingServiceUri, requestUpcomingUri, start, end);
        log.info("🌐 WebClient 호출: {}", uri);

        return webClient.get()
                .uri(meetingServiceUri + requestUpcomingUri, uriBuilder -> uriBuilder
                        .queryParam("minutes", minutes)
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(status -> status.value() == 500, response -> {
                    log.error("❌ 서버 내부 오류 (500) 발생 - /api/meetings/upcoming");
                    return Mono.error(new RuntimeException("Meeting API Internal Server Error"));
                })
                .bodyToFlux(MeetingResponseDto.class)
                .collectList();
    }


    /**
     * ✅ [🟦 NEW] 현재 시점 이후의 모든 예정된 회의 조회
     */
    public Mono<List<MeetingResponseDto>> findMeetingsByNow(LocalDateTime now) {
        String uri = String.format("%s%s?now=%s", meetingServiceUri, requestScheduledUri, now);
        log.info("🌐 [🟦 WebClient 호출]: {}", uri);

        return webClient.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToFlux(MeetingResponseDto.class)
                .collectList();
    }
}

