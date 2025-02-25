package com.confy.service.meeting.MMSToUGS;

import com.confy.common.responseDto.ApiResponseDto;
import com.confy.dto.MMSToUGS.GroupMembersDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupMembersServiceImpl implements GroupMembersService {

    private final WebClient.Builder webClientBuilder;

    @Value("${services.api-gateway-service.uri}")
    private String apiGatewayServiceUri;
    
    /*
    * 특정 그룹 멤버들 조회
    * */
    @Override
    public Mono<GroupMembersDto> getGroupMembers(Long groupId) {
        String requestUrl = apiGatewayServiceUri + "/api/groups/members/" + groupId;
        log.info("Requesting group members from: {}", requestUrl);

        return webClientBuilder.build()
                .get()
                .uri(requestUrl)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ApiResponseDto<GroupMembersDto>>() {}) // 응답 형식 매칭
                .map(ApiResponseDto::getData) // `data` 필드에서 `GroupMembersDto` 추출
                .doOnError(e -> log.error("Failed to fetch group members", e));
    }
}
