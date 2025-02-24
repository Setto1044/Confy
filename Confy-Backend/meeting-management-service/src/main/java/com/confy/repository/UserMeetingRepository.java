package com.confy.repository;

import com.confy.entity.Meeting;
import com.confy.entity.UserMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserMeetingRepository extends JpaRepository<UserMeeting, Integer> {
    Optional<UserMeeting> findByMeetingAndUserId(Meeting meeting, Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE UserMeeting um SET um.leftAt = :leftAt WHERE um.meeting.meetingId = :meetingId AND um.userId = :userId")
    int updateLeftAt(@Param("meetingId") Long meetingId, @Param("userId") Long userId, @Param("leftAt") LocalDateTime now);

    @Query("SELECT um.speaker FROM UserMeeting um WHERE um.meeting.meetingId = :meetingId AND um.leftAt IS NULL")
    List<String> findSpeakersByMeetingId(@Param("meetingId") Long meetingId);

    @Query("SELECT um.speaker FROM UserMeeting um WHERE um.meeting.meetingId = :meetingId")
    List<String> findParticipantsByMeetingId(@Param("meetingId") Long meetingId);

    @Query("SELECT count(um.speaker) FROM UserMeeting um WHERE um.meeting.meetingId = :meetingId AND um.leftAt IS NULL")
    int findOnlineParticipantsByMeetingId(@Param("meetingId") Long meetingId);
}
