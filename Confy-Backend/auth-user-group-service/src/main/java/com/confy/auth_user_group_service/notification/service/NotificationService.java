package com.confy.auth_user_group_service.notification.service;

import com.confy.auth_user_group_service.group.entity.Group;
import com.confy.auth_user_group_service.notification.entity.Notification;

import java.util.List;

public interface NotificationService {
    /**
     * ✅ 특정 사용자(userId)의 모든 알림 목록 조회
     */
    List<Notification> getNotificationsByUserId(Long userId);

    /**
     * ✅ 미팅 시작 전 알림-특정 사용자(userId)에게 미팅 시작, 10분 전, 30분 전 미팅 알림 전송
     */
    void sendScheduledNotificationsForUser(Long userId);
    void checkMeetingsForNotifications();


    /**
     * ✅ [🟦 NEW] 특정 사용자(userId)의 예정된 회의 알림 전송
     */
    void notifyScheduledMeetings(Long userId);
    void sendGroupInviteNotification(Long userId, Group group);
}
