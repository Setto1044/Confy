package com.confy.auth_user_group_service.auth.service;

import com.confy.auth_user_group_service.auth.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final TokenRepository tokenRepository;

    public void addToBlacklist(String token, LocalDateTime expiryDate) {
        tokenRepository.saveToken(token, expiryDate);
    }

    public boolean isBlacklisted(String token) {
        return tokenRepository.existsToken(token);
    }

    @Scheduled(fixedRate = 3600000) // 1시간마다 실행
    public void cleanupBlacklist() {
        tokenRepository.cleanup();
    }
}