package com.confy.domain.usergroup.repository;


import com.confy.domain.usergroup.entity.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    Optional<UserGroup> findByGroup_GroupIdAndUser_UserId(Long groupId, Long userId);

}
