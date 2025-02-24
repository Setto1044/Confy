package com.confy.service.meeting.MMSToClient;

import com.confy.dto.MMSToClient.MeetingCreateRequestDto;
import com.confy.dto.MMSToClient.MeetingScriptResponseDto;
import com.confy.dto.MMSToUGS.GroupMembersDto;
import com.confy.entity.Meeting;
import com.confy.entity.Summary;
import com.confy.repository.MeetingRepository;
import com.confy.repository.SummaryRepository;
import com.confy.service.meeting.MMSToUGS.GroupMembersService;
import com.confy.service.stt.SttService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingServiceImpl implements MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserMeetingService userMeetingService;
    private final GroupMembersService groupMembersService;
    private final SummaryRepository summaryRepository;
    private final SttService sttService;
    private final MeetingResultService meetingResultService;

    @Override
    @Transactional
    public void saveMeeting(Meeting meeting, String visualType) {

        meetingRepository.save(meeting);

        // isOnline이 true라면 UserMeeting 테이블에 데이터 추가
        if(meeting.isOnline()){
            userMeetingService.saveUserMeeting(meeting, meeting.getHostId());
        }
        log.info("visualType: {}", visualType);

        // summaries 테이블에 visualType 저장
        Summary.VisualType type;
        try{
            type = Summary.VisualType.valueOf(visualType);
            System.out.println(type);
            Summary summary = Summary.builder()
                    .meeting(meeting)
                    .createdAt(LocalDateTime.now())
                    .visualType(type)
                    .build();
            summaryRepository.save(summary);

        } catch(Exception e){
            log.warn("유효한 visualType이 아닙니다: visualType={}", visualType);
            log.error("Summary 저장 중 오류 발생: {}", e.getMessage(), e);
            throw new IllegalArgumentException("유효한 visualType이 아닙니다: visualType=" + visualType);
        }

    }

    @Override
    public Meeting generateUUID(Long id, MeetingCreateRequestDto dto) {
        // 그룹 멤버 확인
        Long groupId = Long.parseLong(dto.getGroupId());
        GroupMembersDto groupMembers = groupMembersService.getGroupMembers(groupId).block();

        if (groupMembers.getMembers() == null || groupMembers.getMembers().stream().noneMatch(user -> user.getId().equals(id))) {
            log.warn("해당 사용자는 이 그룹에 속한 사용자가 아닙니다. userId={}, group ID={}", id, groupId);
            throw new IllegalArgumentException("해당 사용자는 이 그룹에 속한 사용자가 아닙니다. userId=" + id + ", group ID=" + groupId);
        }

        String uuid = UUID.randomUUID().toString();
        // startedAt 변환
        LocalDateTime startedAt = LocalDateTime.parse(dto.getStartedAt());
        LocalDateTime now = LocalDateTime.now();

        // 현재 시간과 비교하여 online 여부 결정
        boolean isOnline = !startedAt.isAfter(now);  // startedAt이 현재시간보다 같거나 이전이면 true

        return Meeting.builder()
                .meetingUuid(uuid)
                .meetingName(dto.getMeetingName())
                .startedAt(startedAt)
                .endedAt(null)
                .hostId(id)
                .groupId(Long.parseLong(dto.getGroupId()))
                .isOnline(isOnline)
                .build();

    }

    @Override
    @Transactional
    public boolean finishMeeting(Long meetingId, String meetingUuid, Long userId) {
        Optional<Meeting> optionalMeeting = meetingRepository.findById(meetingId);

        if(optionalMeeting.isEmpty()){
            log.warn("해당되는 회의를 찾을 수 없습니다: meetingId={}", meetingId);
            throw new IllegalArgumentException("해당되는 회의를 찾을 수 없습니다: meetingId=" + meetingId);
        }

        Long groupId = optionalMeeting.get().getGroupId();


        //그룹 멤버인지 체크
        GroupMembersDto groupMembers = groupMembersService.getGroupMembers(groupId).block();
        if(groupMembers == null || groupMembers.getMembers().stream().noneMatch(user -> user.getId().equals(userId))){
            log.warn("해당 사용자는 이 그룹에 속한 사용자가 아닙니다. group ID: {}", groupId);
            throw new IllegalArgumentException("해당 사용자는 이 그룹에 속한 사용자가 아닙니다. group ID: " + groupId);

        }else if(!optionalMeeting.get().getMeetingUuid().equals(meetingUuid)){
            log.warn("매칭되는 meetingId와 meetingUUID가 없습니다: meetingId={} meetingUUID={}", meetingId, meetingUuid);
            throw new IllegalArgumentException("매칭되는 meetingId와 meetingUUID가 없습니다: meetingId=" + meetingId + " meetingUUID=" + meetingUuid);

        }else if(!optionalMeeting.get().isOnline()){
            log.warn("해당 회의는 이미 종료된 회의입니다: meetingId={}, meetingUuid={}", meetingId, meetingUuid);
            throw new IllegalArgumentException("해당 회의는 이미 종료된 회의입니다: meetingId=" + meetingId + ", meetingUuid=" + meetingUuid);

        }

        Meeting meeting = optionalMeeting.get(); //optional에서 실제 Meeting 객체를 가져옴
        meeting.setIsOnline(false);
        meeting.setEndedAt(LocalDateTime.now());
        meetingRepository.save(meeting);

        log.info("회의 종료 완료: meetingId={}, meetingUuid={}", meetingId, meetingUuid);

        return true;
    }

    @Override
    public MeetingScriptResponseDto getMeetingScript(Long userId, Long meetingId) {
        //1. 회의 존재 여부 확인
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("해당 회의는 존재하지 않습니다. meetingId=" + meetingId));

        //2. 사용자가 해당 회의의 멤버인지 확인
        Long groupId = meeting.getGroupId();
        GroupMembersDto groupMembers = groupMembersService.getGroupMembers(groupId).block();
        if (groupMembers == null || groupMembers.getMembers().stream().noneMatch(user -> user.getId().equals(userId))) {
            throw new IllegalArgumentException("해당 사용자는 이 회의의 멤버가 아닙니다. userId=" + userId + ", group ID=" + groupId);
        }

        // 3. Redis에서 STT 데이터 조회
        return sttService.getScript(meetingId, null, null);
    }
}
