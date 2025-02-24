package com.confy.auth_user_group_service.notification.sse;

import com.confy.auth_user_group_service.group.repository.UserGroupRepository;
import com.confy.auth_user_group_service.group.service.GroupService;
import com.confy.auth_user_group_service.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SseService {

    private final SseEmitterRepository sseEmitterRepository;
    private final UserGroupRepository userGroupRepository; // 🟦 UserGroupRepository 추가
    private final UserService userService; // 🟦 UserService 추가
    private final GroupService groupService; // 🟦 GroupService 추가

    /**
     * ✅ 특정 사용자에게 알림 전송
     */
    public void sendNotification(Long userId, String message) {
        // 사용자가 해당 그룹에 속해 있을 때만 알림을 보내도록 필터링
        if (userGroupRepository.existsByUserAndGroupAndLeftAtIsNull(userService.getUserById(userId), groupService.getGroupById(userId))) {
            SseEmitter emitter = sseEmitterRepository.get(userId);
            if (emitter != null) {
                try {
                    emitter.send(SseEmitter.event().name("notification").data(message));
                    System.out.println("📢 [SSE 전송 - 단일 사용자]: userId=" + userId + ", message=" + message);
                } catch (IOException e) {
                    sseEmitterRepository.remove(userId);
                    System.err.println("⚠️ [SSE 전송 실패 - 단일 사용자]: userId=" + userId);
                }
            }
        } else {
//            System.out.println("❌ [알림 미전송 - 그룹에 속하지 않은 사용자]: userId=" + userId);
        }
    }

    /**
     * ✅ 모든 사용자에게 알림 전송
     */
    public void sendToAllUsers(String message) {
        Map<Long, SseEmitter> emitters = sseEmitterRepository.getAllEmitters();
        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name("notification").data(message));
                System.out.println("📢 [SSE 전송 - 전체 사용자]: userId=" + userId + ", message=" + message);
            } catch (IOException e) {
                sseEmitterRepository.remove(userId);
                System.err.println("⚠️ [SSE 전송 실패 - 전체 사용자]: userId=" + userId);
            }
        });
    }
}
