package com.confy.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sentences")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sentence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="sentence_pk")
    private Long sentencePk;

    // Meeting 엔티티와 연관 (여러 Sentence가 하나의 Meeting에 속함)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @Column(name="speaker", nullable = false, length = 255)
    private String speaker;

    @Column(name="content", nullable = false, length = 1000)
    private String content;

    @Column(name = "timestamp", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime timestamp;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Builder
    public Sentence(Meeting meeting, String speaker, String content, LocalDateTime timestamp, Long userId) {
        this.meeting = meeting;
        this.speaker = speaker;
        this.content = content;
        this.timestamp = timestamp;
        this.userId = userId;
    }

}
