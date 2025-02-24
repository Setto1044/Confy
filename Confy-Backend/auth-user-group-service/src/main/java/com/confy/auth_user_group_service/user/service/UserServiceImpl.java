package com.confy.auth_user_group_service.user.service;

import com.confy.auth_user_group_service.auth.service.TokenBlacklistService;
import com.confy.auth_user_group_service.auth.util.JwtUtil;
import com.confy.auth_user_group_service.common.image.ImageManager;
import com.confy.auth_user_group_service.user.dto.*;
import com.confy.auth_user_group_service.user.entity.User;
import com.confy.auth_user_group_service.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ImageManager imageManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;

    @Override
    @Transactional
    public User createUser(UserJoinRequestDto dto) {
        // 이메일 중복 검증
        if (userRepository.existsByEmailAndDeletedAtIsNull(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // 유저 생성 및 저장
        User user = User.builder()
                .email(dto.getEmail())
                .password(encodedPassword)
                .fullName(dto.getFullName())
                .build();

        User result = userRepository.save(user);
        if (result.getCreatedAt() == null) {
            throw new IllegalArgumentException("회원 가입에 실패했습니다.");
        }
        return userRepository.save(user);
    }

    @Override
    public UserLoginResponseDto login(UserLoginRequestDto dto) {
        log.info("Authenticating user with email: {}", dto.getEmail());

        User loginUser = userRepository.findByEmailAndDeletedAtIsNull(dto.getEmail())
                .filter(user -> passwordEncoder.matches(dto.getPassword(), user.getPassword()))
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
        String token = jwtUtil.createToken(loginUser);

        return UserLoginResponseDto.of(token);
    }

    @Override
    public boolean logout(String authHeader) {
        try {
            String token = jwtUtil.extractToken(authHeader);
            if (!jwtUtil.validateToken(token)) {
                return false;
            }
            LocalDateTime expiryDate = jwtUtil.extractExpiryDate(token);
            tokenBlacklistService.addToBlacklist(token, expiryDate);
            return true;
        } catch (Exception e) {
            log.error("Logout processing error", e);
            return false;
        }
    }

    @Override
    public UserSelfResponseDto getMyInfo(Long userId) {
        User foundUser = getUserOrThrow(userId);
        return UserSelfResponseDto.of(foundUser);
    }

    @Override
    public UserOtherResponseDto getOtherUserInfo(Long userId) {
        User foundUser = getUserOrThrow(userId);
        return UserOtherResponseDto.of(foundUser);
    }

    @Override
    @Transactional
    public String uploadProfileImage(Long userId, MultipartFile profileImg) {
        // 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));

        // 기존 이미지 파일 서버에서 삭제
        imageManager.deleteImage(user.getProfileUrl());

        // 이미지 저장 (ImageManager 활용)
        String profileUrl = null;
        try {
            profileUrl = imageManager.saveImage(profileImg);

        } catch (IOException e) {
            log.error(">> Failed to upload profile image", e);
            throw new RuntimeException("파일 업로드 중 문제가 발생했습니다.");
        }
        log.info(">> Upload profile image successful : {}", profileUrl);
        // 유저 엔티티 업데이트
        user.updateProfileUrl(profileUrl);
        userRepository.save(user);

        return profileUrl;
    }

    @Override
    @Transactional
    public void updateFullName(Long userId, String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("이름이 비어있습니다.");
        }

        User user = getUserOrThrow(userId);
        user.updateFullName(fullName);
    }

    @Override
    @Transactional
    public void updatePassword(Long userId, String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호가 비어있습니다.");
        }

        User user = getUserOrThrow(userId);
        String encodedPassword = passwordEncoder.encode(password);
        user.updatePassword(encodedPassword);
    }

    @Override
    @Transactional
    public void updatePushAlert(Long userId, Boolean isPushAlertOn) {
        if (isPushAlertOn == null) {
            throw new IllegalArgumentException("알림 설정 값이 비어있습니다.");
        }

        User user = getUserOrThrow(userId);
        user.updatePushAlert(isPushAlertOn);
    }

    @Override
    @Transactional
    public void updateMeetingAlert(Long userId, Boolean isMeetingAlertOn) {
        if (isMeetingAlertOn == null) {
            throw new IllegalArgumentException("미팅 알림 설정 값이 비어있습니다.");
        }

        User user = getUserOrThrow(userId);
        user.updateMeetingAlert(isMeetingAlertOn);
    }

    @Override
    @Transactional
    public void updateGroupAlert(Long userId, Boolean isGroupAlertOn) {
        if (isGroupAlertOn == null) {
            throw new IllegalArgumentException("그룹 알림 설정 값이 비어있습니다.");
        }

        User user = getUserOrThrow(userId);
        user.updateGroupAlert(isGroupAlertOn);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserOrThrow(userId);
        if (user.getDeletedAt() != null) {
            throw new IllegalArgumentException("이미 삭제된 회원입니다.");
        }
        user.markAsDeleted(LocalDateTime.now());
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("회원 정보를 찾을 수 없습니다."));
    }

    /**
     * 이메일 리스트에 해당하는 사용자 반환
     */
    @Override
    public List<User> findByEmailInAndDeletedAtIsNull(List<String> emails) {
        return userRepository.findByEmailInAndDeletedAtIsNull(emails);
    }

    /**
     * 삭제되지 않은 사용자를 조회하거나 예외를 발생시킵니다.
     */
    private User getUserOrThrow(Long userId) {
        return userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

}