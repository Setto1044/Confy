package com.confy.auth_user_group_service;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;



import java.util.TimeZone;
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class AuthUserGroupServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthUserGroupServiceApplication.class, args);
    }

    @PostConstruct
    public void init() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
    }
}