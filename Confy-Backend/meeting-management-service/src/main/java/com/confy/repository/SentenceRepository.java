package com.confy.repository;

import com.confy.entity.Sentence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SentenceRepository extends JpaRepository<Sentence, Long> {
    List<Sentence> findByMeetingId(Long meetingId);
}
