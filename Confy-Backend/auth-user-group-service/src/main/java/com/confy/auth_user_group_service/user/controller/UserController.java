package com.confy.auth_user_group_service.user.controller;

import com.confy.auth_user_group_service.common.responseDto.ApiResponseDto;
import com.confy.auth_user_group_service.user.dto.*;
import com.confy.auth_user_group_service.user.entity.User;
import com.confy.auth_user_group_service.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<ApiResponseDto<Void>> join(@Valid @RequestBody UserJoinRequestDto dto) {
        log.info(">> join email: {}", dto.getEmail());
        log.info(">> join password: {}", dto.getPassword());
        User user = userService.createUser(dto);

        return ResponseEntity.ok(ApiResponseDto.success("회원가입에 성공했습니다."));
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponseDto<UserLoginResponseDto>> login(@RequestBody UserLoginRequestDto dto) {
        log.info(">> login email: {}", dto.getEmail());
        log.info(">> login password: {}", dto.getPassword());
        return ResponseEntity.ok(ApiResponseDto.success("로그인에 성공했습니다.", userService.login(dto)));
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDto<Void>> logout(@RequestHeader("Authorization") String authHeader) {
        if (!userService.logout(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponseDto.error("로그아웃에 실패했습니다."));
        }
        return ResponseEntity.ok(ApiResponseDto.success("로그아웃 되었습니다."));
    }

    // 내 정보 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponseDto<UserSelfResponseDto>> getMyUserInfo(@RequestHeader("X-User-Id") Long id) {
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보 조회에 성공했습니다.", userService.getMyInfo(id)));
    }

    // 다른 회원 정보 조회
    @GetMapping("other/{userId}")
    public ResponseEntity<ApiResponseDto<UserOtherResponseDto>> getOtherUserInfo(@PathVariable("userId") Long id) {
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보 조회에 성공했습니다.", userService.getOtherUserInfo(id)));
    }

    // 회원 정보 수정 - 프로필 이미지
    @PatchMapping("/me/profile-image")
    public ResponseEntity<ApiResponseDto<UserUpdateProfileImgResponseDto>> updateProfileImage(
            @RequestHeader("X-User-Id") Long id,
            @RequestPart(value = "profileImg", required = true) MultipartFile file,
            HttpServletRequest request) {
        log.info(">> image save request from {}", request.getRequestURI());
        log.info(">> image save request headers {}", request.getHeaderNames().toString());
        log.info(">> image save request data length {}", request.getContentLength());
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보가 수정되었습니다.",
                UserUpdateProfileImgResponseDto.of(userService.uploadProfileImage(id, file))));
    }

    // 회원 정보 수정 - 이름
    @PatchMapping("/me/full-name")
    public ResponseEntity<ApiResponseDto<UserUpdateFullNameDto>> updateFullName(
            @RequestHeader("X-User-Id") Long id,
            @RequestBody UserUpdateFullNameDto dto) {
        userService.updateFullName(id, dto.getFullName());
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보가 수정되었습니다.", dto));
    }

    // 회원 정보 수정 - 푸쉬 알림
    @PatchMapping("/me/push-alert")
    public ResponseEntity<ApiResponseDto<UserUpdatePushAlertDto>> updatePushAlert(
            @RequestHeader("X-User-Id") Long id,
            @RequestBody UserUpdatePushAlertDto dto) {
        userService.updatePushAlert(id, dto.isPushAlertOn());
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보가 수정되었습니다.", dto));
    }

    // 회원 정보 수정 - 미팅 알림
    @PatchMapping("/me/meeting-alert")
    public ResponseEntity<ApiResponseDto<UserUpdateMeetingAlertDto>> updateMeetingAlert(
            @RequestHeader("X-User-Id") Long id,
            @RequestBody UserUpdateMeetingAlertDto dto) {
        userService.updateMeetingAlert(id, dto.isMeetingAlertOn());
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보가 수정되었습니다.", dto));
    }

    // 회원 정보 수정 - 그룹 알림
    @PatchMapping("/me/group-alert")
    public ResponseEntity<ApiResponseDto<UserUpdateGroupAlertDto>> updateGroupAlert(
            @RequestHeader("X-User-Id") Long id,
            @RequestBody UserUpdateGroupAlertDto dto) {
        userService.updateGroupAlert(id, dto.isGroupAlertOn());
        return ResponseEntity.ok(ApiResponseDto.success("회원 정보가 수정되었습니다.", dto));
    }


/**
 * for Test: Delete before Deploy
 */
    /*@PostConstruct
    public void init() {
        String email = "123@ssafy.com";
        String password = "123";
        String fullName = "123";
        UserJoinRequestDto userJoinRequestDto = new UserJoinRequestDto();
        userJoinRequestDto.setEmail(email);
        userJoinRequestDto.setPassword(password);
        userJoinRequestDto.setFullName(fullName);
        User user = User.builder().email(email).password(password).fullName(fullName).build();
        userService.createUser(userJoinRequestDto);
        String token = userService.login(new UserLoginRequestDto(email, password)).getToken();
        log.info("=========================Token=========================");
        System.out.println(token);
        log.info("=========================Token=========================");
    }*/


}
