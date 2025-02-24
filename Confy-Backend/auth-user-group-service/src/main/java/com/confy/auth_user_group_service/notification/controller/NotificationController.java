package com.confy.auth_user_group_service.notification.controller;

import com.confy.auth_user_group_service.notification.entity.Notification;
import com.confy.auth_user_group_service.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//SSE
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import com.confy.auth_user_group_service.notification.sse.SseEmitterRepository;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final SseEmitterRepository sseEmitterRepository; //SSE


    /**
     * ✅ SSE 연결 요청
     */
    @GetMapping(value = "/subscribe", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestHeader("X-User-Id") Long userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        sseEmitterRepository.save(userId, emitter);
        System.out.println("✅ [알림 설정]: userId=" + userId);

        // 연결 종료 시 emitter 제거
        emitter.onCompletion(() -> sseEmitterRepository.remove(userId));
        emitter.onTimeout(() -> sseEmitterRepository.remove(userId));

        return emitter;
    }

    // 알림 전송 확인
    @GetMapping("/notify")
    public ResponseEntity<String> triggerMeetingNotifications() {
        notificationService.checkMeetingsForNotifications();
        return ResponseEntity.ok("🔔 Meeting notifications triggered successfully!");
    }

    /**
    * 전체 알림 목록 조회
     */
    @GetMapping("/users")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @RequestHeader("X-User-Id") Long userId) {

        // ✅ 알림 목록 조회
        List<Notification> notifications = notificationService.getNotificationsByUserId(userId);
        log.info("✅ [알림 조회 완료]: userId={}, 알림 수={}", userId, notifications.size());

        return ResponseEntity.ok(notifications);
    }

    /**
     * ✅ 현재 시점 이후의 모든 예정된 회의 조회 API
     */
    @GetMapping(value = "/scheduled-meetings", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter getScheduledMeetings(@RequestHeader("X-User-Id") Long userId) {
        log.info("🔍 [예약된 회의 조회] 사용자 ID: {}", userId);


        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        notificationService.notifyScheduledMeetings(userId);
        try {
            // 클라이언트에 SSE 메시지 전송
            emitter.send(SseEmitter.event()
                    .name("scheduled-meetings")
                    .data("🔔 [예약된 회의 조회 시작]"));
        } catch (Exception e) {
            emitter.completeWithError(e);
        }
        return emitter;
    }

}






