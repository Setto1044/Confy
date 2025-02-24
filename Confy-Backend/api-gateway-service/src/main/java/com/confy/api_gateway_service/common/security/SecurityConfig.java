package com.confy.api_gateway_service.common.security;

import com.confy.api_gateway_service.common.filter.AuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@EnableWebFluxSecurity
@Configuration
public class SecurityConfig {
    private final AuthenticationFilter authenticationFilter;

    public SecurityConfig(AuthenticationFilter authenticationFilter) {
        this.authenticationFilter = authenticationFilter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                .cors(cors -> {})  // CorsConfig의 설정을 사용
                .csrf(csrf -> csrf.disable())  // CSRF 비활성화
                .authorizeExchange(auth -> auth
                        .pathMatchers("/**").permitAll()  // 모든 경로 허용
                )
                .build();
    }
}