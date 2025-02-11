package com.confy.api_gateway_service.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtParsedUserDto {
    private Long id;
    private String email;
}
