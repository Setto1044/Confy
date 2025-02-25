package com.confy.auth_user_group_service.auth.repository;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryTokenRepository implements TokenRepository {
    private final Map<String, LocalDateTime> tokenMap = new ConcurrentHashMap<>();

    @Override
    public void saveToken(String token, LocalDateTime expiryDate) {
        tokenMap.put(token, expiryDate);
    }

    @Override
    public boolean existsToken(String token) {
        LocalDateTime expiryDate = tokenMap.get(token);
        if (expiryDate == null) {
            return false;
        }

        if (expiryDate.isBefore(LocalDateTime.now())) {
            tokenMap.remove(token);
            return false;
        }
        return true;
    }

    @Override
    public void removeToken(String token) {
        tokenMap.remove(token);
    }

    @Override
    public void cleanup() {
        LocalDateTime now = LocalDateTime.now();
        tokenMap.entrySet().removeIf(entry -> entry.getValue().isBefore(now));
    }
}
