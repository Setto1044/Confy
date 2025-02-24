package com.confy.service.openVidu.MMSToClient;

import com.confy.dto.MMSToUGS.GroupMembersDto;
import com.confy.entity.Meeting;
import com.confy.entity.UserMeeting;
import com.confy.repository.MeetingRepository;
import com.confy.repository.UserMeetingRepository;
import com.confy.service.meeting.MMSToUGS.GroupMembersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OpenViduServiceImpl implements OpenViduService {

    @Autowired
    private final MeetingRepository meetingRepository;
    @Autowired
    private final GroupMembersService getGroupMembersService;
    @Autowired
    private final UserMeetingRepository userMeetingRepository;

    @Override
    @Transactional
    public Meeting validateAndEnterMeeting(String meetingUuid, Long userId, String speaker) {
        Optional<Meeting> optionalMeeting = meetingRepository.findByMeetingUuid(meetingUuid);

        //사용자가 입력한 UUID가 실제로 DB에 존재하는지 체크
        if(optionalMeeting.isEmpty()) {
            throw new IllegalArgumentException("Invalid meeting UUID: " + meetingUuid);
        }

        Meeting meeting = optionalMeeting.get();
        Long groupId = meeting.getGroupId();
        LocalDateTime startAt = meeting.getStartedAt(); //미팅 시작 시간 가져오기
        LocalDateTime endAt = meeting.getEndedAt(); // 미팅 종료 시간

        //최초 참가자인 경우 is_online을 true로 변경
        if(!meeting.isOnline()){
            meeting.setIsOnline(true);
        }

        //그룹 멤버인지 체크
        GroupMembersDto groupMembers = getGroupMembersService.getGroupMembers(groupId).block();
        if(groupMembers == null || groupMembers.getMembers().stream().noneMatch(user -> user.getId().equals(userId))){
            throw new IllegalArgumentException("해당 그룹에 속하지 않은 사용자입니다.");

        }

        //현재 시간이 미팅 시작 시간보다 이전인지 확인
        if(LocalDateTime.now().isBefore(startAt)){
            throw new IllegalArgumentException("The meeting has not started yet. Scheduled start time: " + startAt);
        }

        //해당 미팅이 끝나지 않은 미팅인지(ended_at이 null인지) 확인
        if(endAt != null){
            throw new IllegalArgumentException("The meeting has already ended. End time: " + endAt);
        }

        //검증이 모두 끝났으므로 회의 참가 가능 -> UserMeeting 테이블에 데이터 추가
        saveUserMeetingEntry(meeting, userId, speaker);

        return meeting;
    }

    @Transactional
    public void saveUserMeetingEntry(Meeting meeting, Long userId, String speaker) {
        Optional<UserMeeting> optionalUserMeeting = userMeetingRepository.findByMeetingAndUserId(meeting, userId);

        if(optionalUserMeeting.isPresent()) {
            //이미 존재하는 컬럼인 경우, joined_at을 현재 시간으로 업데이트
            UserMeeting userMeeting = optionalUserMeeting.get();
            userMeeting.updateJoinedAt(LocalDateTime.now());
            userMeeting.updateSpeaker(speaker);
            userMeeting.updateLeftAt(null);

            log.info("Updated joined_at for user {} in meeting {}", userId, meeting.getMeetingId());
        }else{
            //존재하지 않는 경우 새로운 레코드 추가
            System.out.println("No UserMeeting found for user " + userId);
            UserMeeting newUserMeeting = UserMeeting.builder()
                    .meeting(meeting)
                    .userId(userId)
                    .joinedAt(LocalDateTime.now())
                    .isParticipated(true)
                    .speaker(speaker)
                    .build();
            userMeetingRepository.save(newUserMeeting);
        }
    }
}
