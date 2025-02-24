package com.confy.auth_user_group_service.notification.repository;

import com.confy.auth_user_group_service.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * ✅ 특정 사용자의 알림 목록 조회
     */
    List<Notification> findByUserId(Long userId);

    /**
     * ✅ 알림 중복 방지
     */

    boolean existsByUserIdAndMessage(Long userId, String message);

}
