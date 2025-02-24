package com.confy.auth_user_group_service.group.service;

import com.confy.auth_user_group_service.group.dto.GroupDto;
import com.confy.auth_user_group_service.group.entity.Group;
import com.confy.auth_user_group_service.group.entity.UserGroup;
import com.confy.auth_user_group_service.group.repository.GroupRepository;
import com.confy.auth_user_group_service.group.repository.UserGroupRepository;
import com.confy.auth_user_group_service.user.entity.User;
import com.confy.auth_user_group_service.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final UserGroupRepository userGroupRepository;

    @Override
    @Transactional
    public GroupDto createGroup(Long userId, String groupName) {
        User user = userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 1. 그룹 추가
        Group group = Group.builder()
                .groupName(groupName)
                .groupLeaderId(user)
                .createdAt(LocalDateTime.now())
                .build();
        group = groupRepository.save(group);

        // 2. 사용자-그룹 관계 추가
        UserGroup userGroup = UserGroup.builder()
                .user(user)
                .group(group)
                .joinedAt(LocalDateTime.now())
                .build();

        userGroupRepository.save(userGroup);
        return GroupDto.of(group.getId(), group.getGroupName(), group.getGroupLeaderId().getId(), group.getCreatedAt(), group.getDeletedAt());
    }

    /**
     * 그룹장만 그룹 삭제 가능
     */
    @Override
    @Transactional
    public void deleteGroup(Long userId, Long groupId) {
        Group group = groupRepository.findByIdAndDeletedAtIsNull(groupId)
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));

        if (!group.getGroupLeaderId().getId().equals(userId)) {
            throw new IllegalStateException("그룹장만 그룹을 삭제할 수 있습니다.");
        }
        group.softDelete();
    }

    /**
     * 삭제되지 않은 그룹 조회
     */
    @Override
    public GroupDto getGroupDtoById(Long groupId) {
        Group group = groupRepository.findByIdAndDeletedAtIsNull(groupId)
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다 : " + groupId));

        return GroupDto.of(group.getId(), group.getGroupName(), group.getGroupLeaderId().getId(), group.getCreatedAt(), group.getDeletedAt());
    }

    /**
     * Meeting Service에서 사용 -> 삭제된 그룹은 제공 X
     */
    @Override
    public Group getGroupById(Long groupId) {
        return groupRepository.findByIdAndDeletedAtIsNull(groupId)
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));
    }

    @Override
    @Transactional
    public void updateGroupName(Long groupId, Long userId, String newGroupName) {
        Group group = groupRepository.findByIdAndDeletedAtIsNull(groupId)
                .orElseThrow(() -> new IllegalArgumentException("그룹을 찾을 수 없습니다."));

        if (!group.getGroupLeaderId().getId().equals(userId)) {
            throw new IllegalStateException("그룹장만 그룹 이름을 변경할 수 있습니다.");
        }

        group.updateGroupName(newGroupName);
    }
}
