package com.confy.auth_user_group_service.auth.util;

import com.confy.auth_user_group_service.auth.service.TokenBlacklistService;
import com.confy.auth_user_group_service.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtUtil {
    private final Key secretKey;
    private final long validityInMilliseconds;
    private final TokenBlacklistService blacklistService;

    public JwtUtil(@Value("${jwt.secret-key}") String secretKey,
                   @Value("${jwt.validity}") long validityInMilliseconds,
                   TokenBlacklistService blacklistService) {
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.validityInMilliseconds = validityInMilliseconds;
        this.blacklistService = blacklistService;
    }

    public String createToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());  // email을 subject로 사용
        claims.put("id", String.valueOf(user.getId()));  // id도 포함
        claims.put("email", user.getEmail());  // email도 별도 claim으로 포함

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long extractId(String token) {
        String id = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("id", String.class);
        return Long.valueOf(id);
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();  // email은 subject에서 추출
    }

    // JWT 토큰의 모든 claim 추출
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public LocalDateTime extractExpiryDate(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        return LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault());
    }

    public boolean validateToken(String token) {
        try {
            if (blacklistService.isBlacklisted(token)) {
                return false;
            }

            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration()
                    .after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String extractToken(String authHeader) {
        if (authHeader != null) {
            if (authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
            return authHeader;
        }
        throw new IllegalArgumentException("authorization 헤더가 비어있습니다.");
    }
}