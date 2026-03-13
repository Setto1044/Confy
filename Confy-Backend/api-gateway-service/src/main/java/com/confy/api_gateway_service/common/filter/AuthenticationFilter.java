package com.confy.api_gateway_service.common.filter;

import com.confy.api_gateway_service.common.dto.JwtParsedUserDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Component
@Slf4j
public class AuthenticationFilter implements WebFilter, Ordered {

    private final WebClient webClient;

    @Value("${services.auth-user-group-service.uri}")
    private String authServiceUrl;

    @Value("${uri.login}")
    private String loginUri;

    @Value("${uri.join}")
    private String joinUri;

    @Value("${uri.images}")
    private String imageUri;

    private static final List<String> EXCLUDED_PATHS = new ArrayList<>();

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (request.getMethod() == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        if (EXCLUDED_PATHS.stream().anyMatch(path -> request.getURI().getPath().startsWith(path))) {
            return chain.filter(exchange);
        }

        if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            return unauthorizedResponse(exchange);
        }

        String token = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        return webClient
                .post()
                .uri(authServiceUrl + "/auth/validate")
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(JwtParsedUserDto.class)
                .flatMap(user -> {
                    ServerHttpRequest modifiedRequest = request.mutate()
                            .headers(headers -> {
                                headers.set("X-User-Id", String.valueOf(user.getId()));
                                headers.set("X-User-Email", user.getEmail());
                            })
                            .build();

                    return chain.filter(exchange.mutate()
                            .request(modifiedRequest)
                            .build());
                })
                .onErrorResume(e -> {
                    log.error("Authentication error: ", e);
                    return unauthorizedResponse(exchange);
                });
    }

    @PostConstruct
    public void init() {
        EXCLUDED_PATHS.add(loginUri);
        EXCLUDED_PATHS.add(joinUri);
        EXCLUDED_PATHS.add(imageUri);
        EXCLUDED_PATHS.add(imageUri + "/");
    }
}