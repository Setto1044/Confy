package com.confy.auth_user_group_service.group.repository;

import com.confy.auth_user_group_service.group.entity.Group;
import com.confy.auth_user_group_service.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findById(Long id);
}
