package com.confy.service.meeting.MMSToUGS;

import com.confy.dto.MMSToUGS.MeetingTimeResponseDto;
import com.confy.entity.Meeting;
import com.confy.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingTimeServiceImpl implements MeetingTimeService {

    private final MeetingRepository meetingRepository;

    // 특정 시간대 회의 조회
    @Override
    public List<MeetingTimeResponseDto> getMeetingsStartingInMinutes(int minutes) {
        // ✅ ±2분 오차 범위 설정
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = now.plusMinutes(minutes - 2);
        LocalDateTime end = now.plusMinutes(minutes + 2);

        log.info("🔍 {}분 전 회의 조회: {} ~ {}", minutes, start, end);

        // ✅ 2분 오차 범위를 포함하여 회의 리스트 조회
        List<Meeting> meetings = meetingRepository.findByStartedAtBetween(start, end);

        // ✅ 조회된 회의를 DTO로 변환
        return meetings.stream()
                .map(meeting -> new MeetingTimeResponseDto(
                        meeting.getMeetingId(),
                        meeting.getMeetingName(),
                        meeting.getMeetingUuid(),
                        meeting.getStartedAt(),
                        meeting.getGroupId()
                ))
                .collect(Collectors.toList());
    }

    /**
     * ✅ [🟦 NEW] 현재 시점 이후의 모든 예정된 회의 조회
     */
    @Override
    public List<MeetingTimeResponseDto> getScheduledMeetings(LocalDateTime now) { // 🟦 NEW: 매개변수 now 포함
        List<Meeting> meetings = meetingRepository.findMeetingsByNow(now); // 🟦 NEW: findMeetingsByNow 호출
        log.info("🔍 [🟦 NEW] 현재 시점 이후의 회의 조회 완료: {}건", meetings.size());

        return meetings.stream()
                .map(meeting -> new MeetingTimeResponseDto(
                        meeting.getMeetingId(),
                        meeting.getMeetingName(),
                        meeting.getMeetingUuid(),
                        meeting.getStartedAt(),
                        meeting.getGroupId()))
                .collect(Collectors.toList());
    }
}