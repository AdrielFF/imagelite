package io.github.adrielff.imageliteapi.application.user;

import io.github.adrielff.imageliteapi.domain.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    User toUser(UserDTO dto) {
        return User
                .builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
    }
}
