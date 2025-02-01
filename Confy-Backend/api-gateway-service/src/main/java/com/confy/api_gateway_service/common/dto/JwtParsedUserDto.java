package com.confy.api_gateway_service.common.dto;

public class JwtParsedUserDto {
    private Long id;
    private String username;

    public JwtParsedUserDto() {
    }

    public JwtParsedUserDto(Long id, String username) {
        this.id = id;
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }
}
