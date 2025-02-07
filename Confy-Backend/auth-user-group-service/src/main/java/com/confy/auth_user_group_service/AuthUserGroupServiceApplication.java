package com.confy.auth_user_group_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AuthUserGroupServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthUserGroupServiceApplication.class, args);
    }

}
