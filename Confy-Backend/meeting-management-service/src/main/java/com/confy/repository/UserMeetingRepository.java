package com.confy.repository;

import com.confy.entity.Meeting;
import com.confy.entity.UserMeeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMeetingRepository extends JpaRepository<UserMeeting, Integer> {
    Optional<UserMeeting> findByMeetingAndUserId(Meeting meeting, Long userId);
}
