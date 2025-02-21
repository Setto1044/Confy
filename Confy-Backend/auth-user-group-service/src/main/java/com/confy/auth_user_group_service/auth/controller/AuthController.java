package com.confy.auth_user_group_service.auth.controller;

import com.confy.auth_user_group_service.auth.dto.ParsedJwtUserDto;
import com.confy.auth_user_group_service.auth.util.JwtUtil;
import com.confy.auth_user_group_service.common.responseDto.ApiResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/validate")
    public ResponseEntity<?> verifyToken(@RequestHeader("Authorization") String authHeader) {
        try {
            // "Bearer " 제거
            String token = authHeader;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }

            if (!jwtUtil.validateToken(token)) {
                log.warn(">> Invalid or expired token: {}", token.substring(0, 7) + "...");
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponseDto.error("유효하지 않거나 만료된 토큰입니다."));
            }

            ParsedJwtUserDto userDto = ParsedJwtUserDto.builder()
                    .id(jwtUtil.extractId(token))
                    .email(jwtUtil.extractEmail(token))
                    .build();

            log.info("사용자 토큰 검증: id({}), email: ({})", userDto.getId(), userDto.getEmail());

            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            log.error(">> 사용자 토큰 검증 오류 발생: Token({})", authHeader.substring(0, 7) + "...");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}