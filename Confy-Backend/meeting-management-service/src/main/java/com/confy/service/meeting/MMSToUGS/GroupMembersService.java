package com.confy.service.meeting.MMSToUGS;

import com.confy.dto.MMSToUGS.GroupMembersDto;
import reactor.core.publisher.Mono;

public interface GroupMembersService {

    Mono<GroupMembersDto> getGroupMembers(Long groupId);
}
