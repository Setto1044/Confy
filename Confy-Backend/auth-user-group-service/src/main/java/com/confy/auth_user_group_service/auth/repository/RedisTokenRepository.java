package com.confy.auth_user_group_service.auth.repository;

//import org.springframework.data.redis.core.RedisTemplate;

import java.time.LocalDateTime;

//@Repository
//@Primary  // 이 구현체를 우선 사용하도록 설정
//@RequiredArgsConstructor
public class RedisTokenRepository implements TokenRepository {
    @Override
    public void saveToken(String token, LocalDateTime expiryDate) {

    }

    @Override
    public boolean existsToken(String token) {
        return false;
    }

    @Override
    public void removeToken(String token) {

    }

    @Override
    public void cleanup() {

    }


    /*private final RedisTemplate<String, String> redisTemplate;
    private static final String KEY_PREFIX = "blacklist:";

    @Override
    public void saveToken(String token, LocalDateTime expiryDate) {
        long expiryTimeMillis = expiryDate
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli() - System.currentTimeMillis();

        redisTemplate.opsForValue()
                .set(KEY_PREFIX + token, "1", expiryTimeMillis, TimeUnit.MILLISECONDS);
    }

    @Override
    public boolean existsToken(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(KEY_PREFIX + token));
    }

    @Override
    public void removeToken(String token) {
        redisTemplate.delete(KEY_PREFIX + token);
    }

    @Override
    public void cleanup() {
        // Redis는 자동으로 만료된 키를 제거하므로 별도 구현 불필요
    }*/
}