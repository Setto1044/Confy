package com.confy.auth_user_group_service.common.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info(">> 이미지 조회 요청: {}", registry.toString());
        registry.addResourceHandler("/api/images/**")
                .addResourceLocations("file:" + uploadDirectory + "/"); // "file:" 추가
    }
}