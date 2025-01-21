package com.confy.redisTest.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class RedisDataTestDto<T> {
    String key;
    T value;
}
