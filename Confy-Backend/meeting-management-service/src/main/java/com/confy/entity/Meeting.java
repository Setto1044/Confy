package com.confy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meetings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="meeting_id")
    private Long meetingId;

    @Column(name="meeting_uuid", nullable = false, unique = true, length = 100)
    private String meetingUuid;

    @Column(name="meeting_name", nullable = false, length = 100)
    private String meetingName;

    @Column(name="started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name="ended_at")
    private LocalDateTime endedAt;

    @Column(name = "host_id", nullable = false)
    private Long hostId;

    @Column(name = "group_id", nullable = false)
    private Long groupId;

    @Column(name = "is_online", nullable = false, columnDefinition = "TINYINT(1) default 0")
    private boolean isOnline;

    // 연관관계: Meeting 삭제 시 연관된 Sentence, UserMeeting, Summary 모두 삭제됨
    @OneToMany(mappedBy = "meeting", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Sentence> sentences = new ArrayList<>();

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<UserMeeting> userMeetings = new ArrayList<>();

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Summary> summaries = new ArrayList<>();

    @Builder
    public Meeting(String meetingUuid, String meetingName, LocalDateTime startedAt, LocalDateTime endedAt, Long hostId, Long groupId, boolean isOnline) {
        this.meetingUuid = meetingUuid;
        this.meetingName = meetingName;
        this.startedAt = startedAt;
        this.endedAt = endedAt;
        this.hostId = hostId;
        this.groupId = groupId;
        this.isOnline = isOnline;
    }

    public void setIsOnline(boolean isOnline) {
        this.isOnline = isOnline;
    }

    public void setEndedAt(LocalDateTime now) {
        this.endedAt = now;
    }
}
