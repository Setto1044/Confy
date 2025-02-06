package com.confy.auth_user_group_service.auth.repository;

import java.time.LocalDateTime;

public interface TokenRepository {
    void saveToken(String token, LocalDateTime expiryDate);

    boolean existsToken(String token);

    void removeToken(String token);

    void cleanup();  // 만료된 토큰 정리
}