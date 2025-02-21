package com.confy.service.meeting.MMSToUGS;

import com.confy.dto.MMSToUGS.MeetingTimeResponseDto;
import com.confy.entity.Meeting;
import com.confy.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingListServiceImpl implements MeetingListService {

    private final MeetingRepository meetingRepository;

    @Override
    public List<Meeting> getMeetings(String type, List<Long> groupIds, Long cursor, int size) {

        try {
            if (cursor == null) {
                log.info("초기 조회 요청: groupIds={}, size={}", groupIds, size);
                List<Meeting> result = meetingRepository.findInitialMeetings(groupIds, size);
                log.info(">>  meeting result size{}", result.size());
                return meetingRepository.findInitialMeetings(groupIds, size);
            }

            if ("group".equalsIgnoreCase(type) && groupIds.size() == 1) {
                log.info("단일 그룹 조회 요청: groupId={}, cursor={}, size={}", groupIds.get(0), cursor, size);
                return meetingRepository.findMeetingsByGroup(groupIds.get(0), cursor, size);
            }

            log.info("전체 그룹 조회 요청: groupIds={}, cursor={}, size={}", groupIds, cursor, size);
            return meetingRepository.findMeetingsByGroups(groupIds, cursor, size);
        } catch (Exception e) {
            log.error("회의 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return Collections.emptyList(); // 오류 발생 시 빈 리스트 반환
        }

    }

}
