package com.confy.auth_user_group_service.meetingResult.webClient;

import com.confy.auth_user_group_service.meetingResult.dto.MeetingResultDto;
import com.confy.auth_user_group_service.meetingResult.dto.MeetingResultListDto;
import com.confy.auth_user_group_service.meetingResult.enums.MeetingResultType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MeetingInfoWebClient {

    private final WebClient webClient;

    @Value("${meetingservice.uri.base}")
    private String meetingServiceUri;

    @Value("${meetingservice.uri.request.list}")
    private String requestUri;

    public Mono<List<MeetingResultDto>> getMeetingList(Long userId, MeetingResultType type, List<Long> groupIds, Long cursor, int size) {
        // 리스트를 쉼표(,)로 변환하여 Query Param에 넣음
        String groupIdParam = (groupIds != null && !groupIds.isEmpty())
                ? String.join(",", groupIds.stream().map(String::valueOf).toList())
                : null;

        return webClient.get()
                .uri(meetingServiceUri + requestUri, uriBuilder -> {
                    var builder = uriBuilder
                            .queryParam("type", type)
                            .queryParam("group-id", groupIdParam)
                            .queryParam("size", size);

                    if (cursor != null) {
                        builder.queryParam("cursor", cursor);
                    }

                    return builder.build();
                })
                .header("X-User-Id", String.valueOf(userId))
                .retrieve()
                .bodyToMono(MeetingResultListDto.class)
                .map(MeetingResultListDto::getMeetings);

    }

}
