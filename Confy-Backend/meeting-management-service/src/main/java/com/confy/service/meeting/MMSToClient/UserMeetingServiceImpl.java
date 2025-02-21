package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.MeetingExitDto;
import com.confy.entity.Meeting;
import com.confy.entity.UserMeeting;
import com.confy.repository.UserMeetingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserMeetingServiceImpl implements UserMeetingService {

    private final UserMeetingRepository userMeetingRepository;

    @Override
    @Transactional
    public UserMeeting saveUserMeeting(Meeting meeting, Long userId) {

        UserMeeting userMeeting = UserMeeting.builder()
                .meeting(meeting)
                .userId(userId) // 요청 헤더에서 가져온 유저 ID
                .isMvp(false) // 기본값으로 MVP 아님
                .joinedAt(LocalDateTime.now()) // 현재 시각 기준 joinedAt
                .leftAt(null) // 아직 leftAt 없음
                .isParticipated(true) // 참가자로 설정
                .deletedAt(null) // 기본값 설정
                .bookmarkedAt(null) // 기본값 설정
                .build();

        return userMeetingRepository.save(userMeeting);
    }

    @Override
    @Transactional
    public MeetingExitDto exitMeeting(Long meetingId, Long userId) {
        //회의방 나가기
        LocalDateTime now = LocalDateTime.now();
        int updateLeftAt = userMeetingRepository.updateLeftAt(meetingId, userId, now);

        if(updateLeftAt == 0) {
            throw new IllegalArgumentException("UserMeeting not found for meetingId: " + meetingId + " and userId: " + userId);
        }

        return MeetingExitDto.of(userMeetingRepository.findOnlineParticipantsByMeetingId(meetingId));

    }

    @Override
    public List<String> getSpeakersByMeetingId(Long meetingId) {
        return userMeetingRepository.findSpeakersByMeetingId(meetingId);
    }
}
