package com.confy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_meeting")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserMeeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="user_meeting_pk")
    private Long userMeetingPk;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="meeting_id", nullable = false)
    private Meeting meeting;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "is_mvp", columnDefinition = "TINYINT(1)")
    private boolean isMvp;

    @Column(name="joined_at")
    private LocalDateTime joinedAt;

    @Column(name="left_at")
    private LocalDateTime leftAt;

    @Column(name = "is_participant", nullable = false, columnDefinition = "TINYINT(1) default 0")
    private boolean isParticipant;

    @Column(name="deleted_at")
    private LocalDateTime deletedAt;

    @Column(name="bookmarked_at")
    private LocalDateTime bookmarkedAt;

    @Column(name="speaker", length = 100)
    private String speaker;

    @Builder
    public UserMeeting(Meeting meeting,
                       Long userId,
                       boolean isMvp,
                       LocalDateTime joinedAt,
                       LocalDateTime leftAt,
                       boolean isParticipated,
                       LocalDateTime deletedAt,
                       LocalDateTime bookmarkedAt,
                       String speaker) {
        this.meeting = meeting;
        this.userId = userId;
        this.isMvp = isMvp;
        this.joinedAt = joinedAt;
        this.leftAt = leftAt;
        this.isParticipant = isParticipated;
        this.deletedAt = deletedAt;
        this.bookmarkedAt = bookmarkedAt;
        this.speaker = speaker;
    }

    //joind_at 업데이트 메서드
    public void updateJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    //left_at 업데이트 메서드
    public void updateLeftAt(LocalDateTime leftAt) {
        this.leftAt = leftAt;
    }

    //speaker 업데이트 메서드
    public void updateSpeaker(String speaker) {
        this.speaker = speaker;
    }
}
