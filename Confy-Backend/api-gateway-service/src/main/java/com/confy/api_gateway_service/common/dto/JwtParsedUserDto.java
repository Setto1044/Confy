package com.confy.api_gateway_service.common.dto;

public class JwtParsedUserDto {
    private Long id;
    private String email;

    public JwtParsedUserDto() {
    }

    public JwtParsedUserDto(Long id, String email) {
        this.id = id;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }
}
