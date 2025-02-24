package com.confy.repository;

import com.confy.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    Optional<Meeting> findByMeetingUuid(String meetingUuid);

    @Query("SELECT m FROM Meeting m WHERE m.groupId IN :groupIds ORDER BY m.startedAt DESC LIMIT :size")
    List<Meeting> findInitialMeetings(@Param("groupIds") List<Long> groupIds, @Param("size") int size);

    @Query("SELECT m FROM Meeting m WHERE m.groupId = :groupId AND m.meetingId > :cursor ORDER BY m.startedAt DESC LIMIT :size")
    List<Meeting> findMeetingsByGroup(@Param("groupId") Long groupId, @Param("cursor") Long cursor, @Param("size") int size);

    @Query("SELECT m FROM Meeting m WHERE m.groupId IN :groupIds AND m.meetingId > :cursor ORDER BY m.startedAt DESC LIMIT :size")
    List<Meeting> findMeetingsByGroups(@Param("groupIds") List<Long> groupIds, @Param("cursor") Long cursor, @Param("size") int size);


    /** Upcoming: 특정 시간 사이의 미팅 조회: 회의 시작 10분, 30분 전 알림
     */
    List<Meeting> findByStartedAtBetween(LocalDateTime startedAtAfter, LocalDateTime startedAtBefore);

    /** Scheduled: 현재 시간 이후의 미팅 조회: 회의 시작 알림, 예정된 미팅 조회
     */
    @Query("SELECT m FROM Meeting m WHERE m.startedAt >= :now ORDER BY m.startedAt ASC")
    List<Meeting> findMeetingsByNow(@Param("now") LocalDateTime now);


}
