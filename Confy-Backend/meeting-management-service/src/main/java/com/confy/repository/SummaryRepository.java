package com.confy.repository;

import com.confy.entity.Summary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SummaryRepository extends JpaRepository<Summary, Long> {

    // MeetingId로 Summary를 조회
    Summary findByMeeting_MeetingId(Long meetingId);
}
