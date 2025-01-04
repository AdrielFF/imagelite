package io.github.adrielff.imageliteapi.infra;

import io.github.adrielff.imageliteapi.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByEmail(String email);
}
