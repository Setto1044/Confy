package com.confy.auth_user_group_service.group.repository;

import com.confy.auth_user_group_service.group.entity.UserGroup;
import com.confy.auth_user_group_service.user.entity.User;
import com.confy.auth_user_group_service.group.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserGroupRepository extends JpaRepository<UserGroup, Long>, JpaSpecificationExecutor<UserGroup> {

    // 그룹 아이디로 그룹 구성원 유저 아이디 불러오기
    @Query("SELECT ug.user.id FROM UserGroup ug WHERE ug.group.id = :groupId")
    List<Long> findUserIdsByGroupId(Long groupId);

    // 그룹 아이디로 그룹 이름 불러오기
    @Query("SELECT g.groupName FROM Group g WHERE g.id = :groupId")
    String findGroupNameByGroupId(Long groupId);


    // 특정 그룹에 속한 모든 유저 조회
    List<UserGroup> findByGroup(Group group);

    // 특정 유저가 속한 모든 그룹 조회
    List<UserGroup> findByUser(User user);

    // 특정 유저가 속해 있으며 아직 나가지 않은 그룹들 조회
    List<UserGroup> findByUserAndLeftAtIsNull(User user);

    // 특정 유저가 특정 그룹에 속해 있는지 확인
    Optional<UserGroup> findByUserAndGroup(User user, Group group);

    // 특정 유저가 특정 그룹에 속해 있으면서 아직 탈퇴하지 않은 경우만 조회
    Optional<UserGroup> findByUserAndGroupAndLeftAtIsNull(User user, Group group);

    // 특정 유저가 그룹에서 나갔는지 확인
    boolean existsByUserAndGroupAndLeftAtIsNotNull(User user, Group group);

    // 특정 유저가 그룹에서 나가지 않았는지 확인
    boolean existsByUserAndGroupAndLeftAtIsNull(User user, Group group);
}
