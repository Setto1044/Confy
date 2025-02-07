package com.confy.auth_user_group_service.meetingResult.service;

import com.confy.auth_user_group_service.meetingResult.dto.MeetingResultListDto;
import com.confy.auth_user_group_service.meetingResult.enums.MeetingResultType;

public interface MeetingResultService {
    MeetingResultListDto getMeetingsByType(Long userId, MeetingResultType type, Long groupId, Long cursor, int size);
}
