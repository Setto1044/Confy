package com.confy.auth_user_group_service.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateProfileImgRequestDto {
    private MultipartFile profileImg;
}
