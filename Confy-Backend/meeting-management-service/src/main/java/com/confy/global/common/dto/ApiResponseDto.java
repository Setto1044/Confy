package com.confy.global.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)

public class ApiResponseDto<T> {
    private boolean success;
    private String message;
    private T data;

    private ApiResponseDto(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // 데이터가 없으면 data 필드를 아예 포함하지 않도록 처리
    public static <T> ApiResponseDto<T> of(boolean success, String message) {
        return new ApiResponseDto<>(success, message, null);
    }

    // 데이터가 있을 경우
    public static <T> ApiResponseDto<T> of(boolean success, String message, T data) {
        return new ApiResponseDto<>(success, message, data);
    }

}
