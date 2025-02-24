package com.confy.auth_user_group_service.notification.service;

import com.confy.auth_user_group_service.group.entity.Group;
import com.confy.auth_user_group_service.meeting.client.MeetingClient;
import com.confy.auth_user_group_service.meeting.dto.MeetingResponseDto;
import com.confy.auth_user_group_service.notification.entity.Notification;
import com.confy.auth_user_group_service.notification.repository.NotificationRepository;
import com.confy.auth_user_group_service.notification.sse.SseEmitterRepository;
import com.confy.auth_user_group_service.notification.sse.SseService;
import com.confy.auth_user_group_service.group.repository.UserGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final MeetingClient meetingClient;
    private final UserGroupRepository userGroupRepository;
    private final SseService sseService;
    private final SseEmitterRepository sseEmitterRepository;


    /**
     * ✨ 특정 사용자(userId)의 알림 목록 전체 조회
     */
    @Override
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    /**
     * ✨ Scheduled Meetings: 사용자별 예약된 회의 조회 및 알림 전송
     */
    @Override
    @Transactional
    public void notifyScheduledMeetings(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        meetingClient.findMeetingsByNow(now)
                .subscribe(meetings -> meetings.forEach(meeting -> {
                    String groupName = userGroupRepository.findGroupNameByGroupId(meeting.getGroupId());
                    String message = generateScheduledMessage(groupName, meeting);
                    sseService.sendNotification(userId, message);
                    log.info("📢 [🟦 예약된 회의 알림 전송]: userId={}, message={}", userId, message);
                }));
    }


    /**
     * ✨ Upcoming Meetings: 회의 시작 전 알림-10분 전, 30분 전 미팅 알림 강제 전송 (중복 제거 포함)
     */
    @Override
    public void sendScheduledNotificationsForUser(Long userId) {
        List.of(10, 30).forEach(minutes -> {
            meetingClient.getMeetingsStartingInMinutes(minutes)
                    .subscribe(meetings -> meetings.forEach(meeting -> {
                        int minutesUntilMeeting = (int) java.time.Duration.between(LocalDateTime.now(), meeting.getStartedAt()).toMinutes();
                        if (Math.abs(minutesUntilMeeting - minutes) <= 1) {
                            sendMeetingNotificationToUser(meeting, minutes, userId);
                        }
                    }));
        });
    }

    public void sendGroupInviteNotification(Long userId, Group group) {
        // 그룹 초대 알림 메시지 생성
        String message = String.format("👥 %s 그룹에 초대되었습니다.", group.getGroupName());

        // 그룹 관련 알림 개별 전송
        sendGroupNotificationToUser(userId, message);
    }



    /**
     * 특정 사용자에게 회의 관련 알림 전송
     */
    @Transactional
    public void sendMeetingNotificationToUser(MeetingResponseDto meeting, int minutesBefore, Long userId) {
        // groupName 조회
        String groupName = userGroupRepository.findGroupNameByGroupId(meeting.getGroupId());

        // 메시지 생성
        String message = generateMessage(groupName, meeting, minutesBefore);

        // 중복 메시지 검사
        if (notificationRepository.existsByUserIdAndMessage(userId, message)) {
            log.info("🚫 [알림 중복 스킵 - 사용자 지정]: userId={}, message={}", userId, message);
            return;
        }

        log.info("📢 [알림]: userId={}, groupName={}, meetingName={}, meetingId={}, minutesBefore={}",
                userId, groupName, meeting.getMeetingName(), meeting.getMeetingId(), minutesBefore);

        // Notification 객체 생성 및 저장
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(Notification.NotificationType.MEETING)
                .url("/meetings/" + meeting.getMeetingId())
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();

        notificationRepository.save(notification);

        // SSE를 통해 모든 사용자에게 메시지 전송
        sseService.sendToAllUsers(message);
    }


    /**
     * ✨ Invite Users To Group: 특정 사용자에게 그룹 초대 관련 알림 전송
     */
    @Transactional
    public void sendGroupNotificationToUser(Long userId, String message) {
        // 중복 알림 검사
        if (notificationRepository.existsByUserIdAndMessage(userId, message)) {
            log.info("🚫 [그룹 알림 중복 스킵]: userId={}, message={}", userId, message);
            return;
        }

        log.info("📢 [그룹 알림 전송]: userId={}, message={}", userId, message);
        // Notification 객체 생성 및 저장
        Notification notification = Notification.builder()
                .userId(userId)
                .message(message)
                .type(Notification.NotificationType.GROUP_INVITE) // 그룹 초대 알림
                .createdAt(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        // 기존 SSE 전송 메서드를 활용하여 특정 사용자에게 알림 전송
        sseService.sendNotification(userId, message);
    }

    // ⬜ [전체 사용자 대상]
    /**
     * ✅ 10분 후 & 30분 후 시작하는 미팅 조회 (비동기)
     * 정확히 10분이나 30분 전이 아니어도 ±1분 오차 허용
     */
    @Scheduled(fixedRate = 30000) // 30초마다 실행하여 조회
    @Override
    public void checkMeetingsForNotifications() {
        List.of(0, 10, 30).forEach(minutes -> {
            meetingClient.getMeetingsStartingInMinutes(minutes)
                    .subscribe(meetings -> meetings.forEach(meeting -> {
                        int minutesUntilMeeting = (int) java.time.Duration.between(LocalDateTime.now(), meeting.getStartedAt()).toMinutes();
                        if (Math.abs(minutesUntilMeeting - minutes) <= 1) {
                            sendMeetingNotificationWithDeduplication(meeting, minutes);
                        } else {
                            log.info("🚫 [알림 스킵]: {} - {}분 후 (기대: {}분)", meeting.getMeetingName(), minutesUntilMeeting, minutes);
                        }
                    }));
        });
    }


    /**
     * 그룹 전체 사용자에게 알림 전송 (중복 제거 포함)
     *  + ✨ Start Meetings: 회의 시작 알림 기능  - 회의 시작 시 "회의가 시작되었습니다" 알림 전송
     */
    @Transactional
    public void sendMeetingNotificationWithDeduplication(MeetingResponseDto meeting, int minutesBefore) {
        List<Long> userIds = userGroupRepository.findUserIdsByGroupId(meeting.getGroupId());

        // groupName 조회
        String groupName = userGroupRepository.findGroupNameByGroupId(meeting.getGroupId());

        for (Long userId : userIds) {
            // 메시지 생성

            // minutesBefore가 0이면 회의 시작 알림 메시지 생성, 아니면 기존 메서드 사용
            String message;
            if (minutesBefore == 0) {
                // 🔔 회의 시작 알림 메시지 생성 (특정 사용자를 대상으로 함)
                message = String.format("🔔 [%s] %s 회의가 시작되었습니다.", groupName, meeting.getMeetingName());
            } else {
                message = generateMessage(groupName, meeting, minutesBefore);
            }

            // 중복 메시지 검사
            if (notificationRepository.existsByUserIdAndMessage(userId, message)) {
                log.info("🚫 [알림 중복 스킵 - 전체 사용자 대상]: userId={}, message={}", userId, message);
                continue;
            }

            log.info("📢 [알림]: userId={}, groupName={}, meetingName={}, meetingId={}, groupId={}, minutesBefore={}",
                    userId, groupName, meeting.getMeetingName(), meeting.getMeetingId(), meeting.getGroupId(), minutesBefore);

            // Notification 객체 생성 및 저장
            Notification notification = Notification.builder()
                    .userId(userId)
                    .message(message)
                    .type(Notification.NotificationType.MEETING)
                    .url("/meetings/" + meeting.getMeetingId())
                    .createdAt(LocalDateTime.now())
                    .isRead(false)
                    .build();

            notificationRepository.save(notification);

            // SSE를 통해 모든 사용자에게 메시지 전송
            sseService.sendToAllUsers(message);
        }
    }

//⬜ 메세지 형식 ⬜

    /**
     * Upcoming Meetings: 10분, 30분 전 회의 알림 메시지 생성 메서드
     */
    private String generateMessage(String groupName, MeetingResponseDto meeting, int minutesBefore) {
        String validGroupName = (groupName == null || groupName.isBlank())
                ? "(groupId: " + meeting.getGroupId() + ")"
                : "[" + groupName + "]";

        String message = String.format(
                "⏰ %s %s 회의가 %d분 후 시작됩니다.",
                validGroupName, meeting.getMeetingName(), minutesBefore
        );

        return message.replaceAll("\\s+", " ").trim();
    }

    /**
     * Scheduled Meetings: 예약된 회의 알림 메시지 생성 메서드
     */
    private String generateScheduledMessage(String groupName, MeetingResponseDto meeting) {
        String validGroupName = (groupName == null || groupName.isBlank())
                ? "(groupId: " + meeting.getGroupId() + ")"
                : "[" + groupName + "]";

        // 시작 시간을 "2월 18일 16시 08분" 형식으로 표시
        String formattedTime = meeting.getStartedAt().format(DateTimeFormatter.ofPattern("M월 d일 H시 m분"));
        String message = String.format("🗓️ %s %s 회의가 %s에 시작됩니다.", validGroupName, meeting.getMeetingName(), formattedTime);

        return message.replaceAll("\\s+", " ").trim();
    }


}
