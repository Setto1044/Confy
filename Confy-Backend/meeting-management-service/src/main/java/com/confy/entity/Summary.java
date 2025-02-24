package com.confy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "summaries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="summary_pk")
    private Long summaryPk;

    @Column(name="text_summary", columnDefinition = "TEXT")
    private String textSummary;

    @Column(name="visual_summary", columnDefinition = "TEXT")
    private String visualSummary;
    //걍 String으로 가져오는 방법

    @Column(name="keywords", length = 255)
    private String keywords;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    // Meeting 엔티티와 연관 (여러 Summary가 하나의 Meeting에 속함)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @Enumerated(EnumType.STRING)
    @Column(name = "visual_type", nullable = false)
    private VisualType visualType;

    @Column(name = "modified_at", nullable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime modifiedAt = LocalDateTime.now();

    @Column(name="summary_image_path", length = 255)
    private String summaryImagePath;

    public enum VisualType {
        Tree,
        Bubble,
        Fishbone
    }

    @Builder
    public Summary(Meeting meeting, LocalDateTime createdAt, VisualType visualType, String textSummary, String visualSummary, String keywords) {
        this.meeting = meeting;
        this.createdAt = createdAt;
        this.visualType = visualType;
        this.textSummary = textSummary;
        this.visualSummary = visualSummary;
        this.keywords = keywords;
    }

    // Setter Methods 추가
    public void setTextSummary(String textSummary) {
        this.textSummary = textSummary;
        this.modifiedAt = LocalDateTime.now(); // 수정 시간 업데이트
    }

    public void setVisualSummary(String visualSummary) {
        this.visualSummary = visualSummary;
        this.modifiedAt = LocalDateTime.now();
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
        this.modifiedAt = LocalDateTime.now();
    }

}
