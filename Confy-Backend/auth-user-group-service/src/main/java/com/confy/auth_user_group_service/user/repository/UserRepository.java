package com.confy.auth_user_group_service.user.repository;

import com.confy.auth_user_group_service.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndDeletedAtIsNull(String email);

    Optional<User> findByIdAndDeletedAtIsNull(Long id);

    boolean existsByEmailAndDeletedAtIsNull(String email);

    // 여러 이메일을 통해 삭제되지 않은 유저 조회
    List<User> findByEmailInAndDeletedAtIsNull(List<String> emails);

}