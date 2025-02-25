package com.confy.auth_user_group_service.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "INT UNSIGNED")
    private Long id;

    @Column(name = "full_name", length = 50, nullable = false)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "profile_url", length = 255)
    private String profileUrl;

    @Column(name = "is_push_alert_on", nullable = false)
    private Boolean isPushAlertOn;

    @Column(name = "is_meeting_alert_on", nullable = false)
    private Boolean isMeetingAlertOn;

    @Column(name = "is_group_alert_on", nullable = false)
    private Boolean isGroupAlertOn;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @Builder
    public User(String email, String password, String fullName) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.isMeetingAlertOn = true;
        this.isGroupAlertOn = true;
        this.isPushAlertOn = true;
    }

    public void updateProfileUrl(String profileUrl) {
        this.profileUrl = profileUrl;
    }

    public void updateFullName(String fullName) {
        this.fullName = fullName;
    }

    public void updatePassword(String password) {
        this.password = password;
    }

    public void updatePushAlert(Boolean isPushAlertOn) {
        this.isPushAlertOn = isPushAlertOn;
    }

    public void updateMeetingAlert(Boolean isMeetingAlertOn) {
        this.isMeetingAlertOn = isMeetingAlertOn;
    }

    public void updateGroupAlert(Boolean isGroupAlertOn) {
        this.isGroupAlertOn = isGroupAlertOn;
    }

    public void markAsDeleted(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }
}