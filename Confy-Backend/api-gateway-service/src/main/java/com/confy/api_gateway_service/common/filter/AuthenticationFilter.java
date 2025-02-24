package com.confy.api_gateway_service.common.filter;

import com.confy.api_gateway_service.common.dto.JwtParsedUserDto;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class AuthenticationFilter implements WebFilter, Ordered {

    private final WebClient.Builder webClientBuilder;

    @Value("${services.auth-user-group-service.uri}")
    private String authServiceUrl;

    @Value("${uri.login}")
    private String loginUri;

    @Value("${uri.join}")
    private String joinUri;

    @Value("${uri.images}")
    private String imageUri;

    // 인증이 필요 없는 경로
    private static final List<String> EXCLUDED_PATHS = new ArrayList<>();

    public AuthenticationFilter(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

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

        // Preflight 요청 (OPTIONS)인 경우 바로 통과
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

        return webClientBuilder.build()
                .post()
                .uri(authServiceUrl + "/auth/validate")
                .header(HttpHeaders.AUTHORIZATION, token)
                .retrieve()
                .bodyToMono(JwtParsedUserDto.class)
                .flatMap(user -> {
                    ServerHttpRequest modifiedRequest;

                    // multipart/form-data 요청인 경우 특별 처리
                    if (request.getHeaders().getContentType() != null &&
                            request.getHeaders().getContentType().includes(MediaType.MULTIPART_FORM_DATA)) {

                        return DataBufferUtils.join(request.getBody())
                                .map(dataBuffer -> {
                                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                                    dataBuffer.read(bytes);
                                    DataBufferUtils.release(dataBuffer);
                                    return bytes;
                                })
                                .defaultIfEmpty(new byte[0])
                                .flatMap(bodyBytes -> {
                                    ServerHttpRequest decoratedRequest = new ServerHttpRequestDecorator(request) {
                                        @Override
                                        public HttpHeaders getHeaders() {
                                            HttpHeaders httpHeaders = new HttpHeaders();
                                            httpHeaders.putAll(request.getHeaders());
                                            httpHeaders.set("X-User-Id", String.valueOf(user.getId()));
                                            httpHeaders.set("X-User-Email", user.getEmail());
                                            return httpHeaders;
                                        }

                                        @Override
                                        public Flux<DataBuffer> getBody() {
                                            if (bodyBytes.length > 0) {
                                                DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bodyBytes);
                                                return Flux.just(buffer);
                                            }
                                            return Flux.empty();
                                        }
                                    };

                                    return chain.filter(exchange.mutate()
                                            .request(decoratedRequest)
                                            .build());
                                });
                    }

                    // 일반 요청인 경우
                    modifiedRequest = request.mutate()
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
