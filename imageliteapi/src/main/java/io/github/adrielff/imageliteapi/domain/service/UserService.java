package io.github.adrielff.imageliteapi.domain.service;

import io.github.adrielff.imageliteapi.domain.AccessToken;
import io.github.adrielff.imageliteapi.domain.entity.User;

public interface UserService {
    User findByEmail(String email);

    User save(User user);

    AccessToken authenticate(String email, String password);
}
