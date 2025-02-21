package com.confy.vo;

import com.confy.entity.Sentence;
import com.confy.entity.Meeting;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Redis에서 받아온 문장 데이터를 보관하기 위한 값 타입 VO.
 * 나중에 DB에 저장할 때, Meeting 엔티티와 결합하여 Sentence 엔티티로 변환할 수 있습니다.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentenceVo {
    private String speaker;
    private String content;
    private LocalDateTime timestamp;
    private Long userId;

    /**
     * 이 값 타입을 Sentence 엔티티로 변환합니다.
     * @param meeting DB에 저장할 대상 Meeting 엔티티 (외래키 값 설정용)
     * @return 변환된 Sentence 엔티티
     */
    public Sentence toEntity(Meeting meeting) {
        return Sentence.builder()
                .meeting(meeting)
                .speaker(this.speaker)
                .content(this.content)
                .timestamp(this.timestamp)
                .userId(this.userId)
                .build();
    }
}
