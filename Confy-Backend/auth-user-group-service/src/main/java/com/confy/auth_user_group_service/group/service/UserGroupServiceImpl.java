package com.confy.auth_user_group_service.group.service;

import com.confy.auth_user_group_service.group.dto.GroupInviteRequestDto;
import com.confy.auth_user_group_service.group.dto.UserGroupDto;
import com.confy.auth_user_group_service.group.entity.Group;
import com.confy.auth_user_group_service.group.entity.UserGroup;
import com.confy.auth_user_group_service.group.repository.UserGroupRepository;
import com.confy.auth_user_group_service.notification.service.NotificationService;
import com.confy.auth_user_group_service.notification.sse.SseEmitterRepository;
import com.confy.auth_user_group_service.notification.sse.SseService;
import com.confy.auth_user_group_service.user.dto.UserOtherResponseDto;
import com.confy.auth_user_group_service.user.entity.User;
import com.confy.auth_user_group_service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserGroupServiceImpl implements UserGroupService {

    private final UserGroupRepository userGroupRepository;
    private final UserService userService;
    private final GroupService groupService;

    private final SseEmitterRepository sseEmitterRepository; // 🟦 SSE
    private final SseService sseService; // 🟦 SSE
    private final NotificationService notificationService;

    /**
     * 그룹에 속한 사용자 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<UserOtherResponseDto> getUsersInGroup(Long groupId) {
        Group group = groupService.getGroupById(groupId);
        List<UserGroup> userGroups = userGroupRepository.findByGroup(group);

        // Lazy Loading 문제 해결을 위해 DTO 변환 후 반환
        return userGroups.stream()
                .filter(userGroup -> userGroup.getLeftAt() == null) // 그룹 내 회원만
                .map(userGroup -> UserOtherResponseDto.of(userGroup.getUser()))
                .collect(Collectors.toList());
    }

    // 사용자가 나가지 않은 그룹 조회
    @Override
    @Transactional(readOnly = true)
    public List<UserGroup> getJoinedGroupsForUser(Long userId) {
        User user = userService.getUserById(userId);
        List<UserGroup> userGroups = userGroupRepository.findByUser(user);

        // leftAt이 null인 경우만 필터링
        return userGroups.stream()
                .filter(userGroup -> userGroup.getLeftAt() == null)
                .collect(Collectors.toList());
    }

    // 사용자가 나가지 않은 그룹 리스트 조회
    @Override
    public List<Long> getGroupIdsForUser(Long userId) {
        User user = userService.getUserById(userId);
        return userGroupRepository.findByUser(user).stream()
                .filter(userGroup -> userGroup.getLeftAt() == null) // 참여중인 그룹만 필터링
                .map(userGroup -> userGroup.getGroup().getId())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isUserInGroup(Long userId, Long groupId) {
        User user = userService.getUserById(userId);
        Group group = groupService.getGroupById(groupId);
        return userGroupRepository.findByUserAndGroup(user, group).isPresent();
    }


    // 이미 존재하는 사용자를 추가하려하면 예외 발생
    @Transactional
    @Override
    public List<UserGroupDto> addUsersToGroup(Long userId, Long groupId, GroupInviteRequestDto requestDto) {
        // GroupService를 통해 그룹 조회
        User invitor = userService.getUserById(userId);
        Group group = groupService.getGroupById(groupId);
        log.info(">> 사용자 '{}' 가 그룹 '{}'에 회원 초대 요청", invitor.getEmail(), group.getGroupName());
        userGroupRepository
                .findByUserAndGroup(invitor, group)
                .orElseThrow(() -> new IllegalArgumentException("그룹에 속하지 않아 초대 권한이 없습니다."));

        List<User> users = userService.findByEmailInAndDeletedAtIsNull(requestDto.getUserEmails());
        log.info(">> 사용자 {}명 추가 시작", users.size());
        if (group.getDeletedAt() != null) {
            throw new IllegalArgumentException("삭제된 그룹입니다.");
        }
        if (users.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        if (userGroupRepository.findByUserAndGroup(invitor, group).isEmpty() || userGroupRepository.existsByUserAndGroupAndLeftAtIsNotNull(invitor, group)) {
            throw new IllegalArgumentException("그룹 초대 권한이 없습니다.");
        }
        // 그룹에 사용자 추가 및 자동 구독 설정 🟦
        return users.stream()
                .map(user -> {
                    UserGroupDto userGroupDto = addUserToGroup(user, group);
                    try {
                        subscribeUserToGroup(user.getId(), group.getId(), String.valueOf(group.getGroupName()));  // 그룹 가입 알림
                        sendGroupInviteNotification(user.getId(), group); // 그룹 가입 알림 🟦
                    } catch (Exception e) {
                        log.warn("⚠️ 그룹 초대 중 알림 전송 실패 발생");
                    }
                    return userGroupDto;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // 한 회원을 그룹에 추가
    @Transactional
    protected UserGroupDto addUserToGroup(User user, Group group) {
        // 이미 그룹에 속해 있는지 확인
        if (userGroupRepository.existsByUserAndGroupAndLeftAtIsNull(user, group)) {
            throw new IllegalArgumentException("이미 해당 그룹에 속한 회원입니다.");
        }

        UserGroup userGroup = UserGroup.builder()
                .user(user)
                .group(group)
                .joinedAt(LocalDateTime.now())
                .build();
        log.info(">> 회원 '{}' 이 그룹 '{}' 가입", user.getId(), group.getId());
        return UserGroupDto.of(userGroupRepository.save(userGroup));
    }

    @Override
    @Transactional
    public void leaveGroup(Long userId, Long groupId) {
        User user = userService.getUserById(userId);
        Group group = groupService.getGroupById(groupId);
        UserGroup userGroup = userGroupRepository.findByUserAndGroup(user, group)
                .orElseThrow(() -> new IllegalArgumentException("이미 그룹에 속한 회원이 아닙니다."));

        if (userGroup.getLeftAt() != null) {
            throw new IllegalArgumentException("이미 그룹에 속한 회원이 아닙니다.");
        }
        userGroup.leaveGroup(LocalDateTime.now());

        // 탈퇴 시 SSE 구독 해제하지 않고 유지- 한 그룹에 속한 적이 있으면 계속 구독. 알림에서 필터.
    }

    /*   // 한 회원을 그룹에 추가하는 메서드
       private UserGroupDto addUserToGroup(User user, Group group) {
           // 이미 그룹에 속해 있는지 확인
           if (userGroupRepository.existsByUserAndGroupAndLeftAtIsNull(user, group)) {
               throw new IllegalArgumentException("이미 해당 그룹에 속한 회원입니다.");
           }

           UserGroup userGroup = UserGroup.builder()
                   .user(user)
                   .group(group)
                   .joinedAt(LocalDateTime.now())
                   .build();
           log.info(">> member {} joined group {}", user.getId(), group.getId());
           return UserGroupDto.of(userGroupRepository.save(userGroup));
       }
   */
    // 사용자 구독 설정 🟦
    private void subscribeUserToGroup(Long userId, long groupId, String groupName) {
        // 해당 사용자가 그룹에 속해 있을 때만 구독을 설정
        if (userGroupRepository.existsByUserAndGroupAndLeftAtIsNull(userService.getUserById(userId), groupService.getGroupById(groupId))) {
            try {
                SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
                sseEmitterRepository.save(userId, emitter);
                emitter.onCompletion(() -> sseEmitterRepository.remove(userId));
                emitter.onTimeout(() -> sseEmitterRepository.remove(userId));

                log.info("✅ [SSE 구독 설정 완료]: userId={}, groupName={}", userId, groupName);
                sseService.sendNotification(userId, "👥 " + groupName + " 그룹에 초대되었습니다");
            } catch (Exception e) {
                log.error("🚨 [SSE 구독 실패]: userId={}, error={}", userId, e.getMessage(), e);
            }
        } else {
            log.warn("⚠️ [SSE 구독 실패]: userId={}가 groupId={}에 속해있지 않음", userId, groupId);
        }
    }


    /**
     * ✨ Invite Message: 그룹 초대 알림 전송 로직
     */

    private void sendGroupInviteNotification(Long userId, Group group) {
        String message = "👥 [" + group.getGroupName() + "] 그룹에 초대되었습니다.";

        // 메시지 전송 전에 SSE 연결 상태 확인
        log.info("✅ [SSE 전송 - 그룹 초대 알림]: userId={}, message={}", userId, message);

        // SSE를 통해 알림 전송
        sseService.sendNotification(userId, message);

    }

}
