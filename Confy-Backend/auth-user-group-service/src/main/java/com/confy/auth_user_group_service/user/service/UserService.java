package com.confy.auth_user_group_service.user.service;

import com.confy.auth_user_group_service.user.dto.*;
import com.confy.auth_user_group_service.user.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    // 회원가입
    User createUser(UserJoinRequestDto dto);

    // 로그인
    UserLoginResponseDto login(UserLoginRequestDto dto);

    // 로그아웃
    boolean logout(String authHeader);

    // 내 정보 조회
    UserSelfResponseDto getMyInfo(Long userId);

    // 다른 회원 정보 조회
    UserOtherResponseDto getOtherUserInfo(Long userId);

    // 프로필 이미지 수정
    String uploadProfileImage(Long userId, MultipartFile profileImg);

    // 이름 수정
    void updateFullName(Long userId, String fullName);

    // 비밀번호 수정
    void updatePassword(Long userId, String password);

    // 푸시 알림 설정 수정
    void updatePushAlert(Long userId, Boolean isPushAlertOn);

    // 미팅 알림 설정 수정
    void updateMeetingAlert(Long userId, Boolean isMeetingAlertOn);

    // 그룹 알림 설정 수정
    void updateGroupAlert(Long userId, Boolean isGroupAlertOn);

    // 회원 삭제
    void deleteUser(Long userId);

    // User Entity 제공
    User getUserById(Long userId);

    // 여러 이메일을 통해 삭제되지 않은 유저 조회
    List<User> findByEmailInAndDeletedAtIsNull(List<String> emails);
}