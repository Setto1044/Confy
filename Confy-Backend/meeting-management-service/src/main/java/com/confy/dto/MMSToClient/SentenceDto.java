package com.confy.dto.MMSToClient;

import com.confy.entity.Sentence;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentenceDto {
    private String speaker;
    private String content;
    private LocalDateTime timestamp;

    public static SentenceDto fromEntity(Sentence sentence) {
        return new SentenceDto(
                sentence.getSpeaker(),
                sentence.getContent(),
                sentence.getTimestamp()
        );
    }

    public static SentenceDto of(String speaker, String content, LocalDateTime timestamp) {
        return new SentenceDto(speaker, content, timestamp);
    }
}
