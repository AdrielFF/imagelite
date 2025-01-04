package io.github.adrielff.imageliteapi.application.user;

import io.github.adrielff.imageliteapi.application.jwt.JwtService;
import io.github.adrielff.imageliteapi.domain.AccessToken;
import io.github.adrielff.imageliteapi.domain.entity.User;
import io.github.adrielff.imageliteapi.domain.exception.DuplicatedTupleException;
import io.github.adrielff.imageliteapi.domain.service.UserService;
import io.github.adrielff.imageliteapi.infra.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public User findByEmail(String email) {
        return repository.findByEmail(email);
    }

    @Override
    public User save(User user) {
        var possibleUser = findByEmail(user.getEmail());

        if(possibleUser != null) {
            throw new DuplicatedTupleException("User already exists!");
        }
        encodePassword(user);

        return repository.save(user);
    }

    @Override
    public AccessToken authenticate(String email, String password) {
        var user = findByEmail(email);

        if(user == null) {
            return null;
        }

        boolean matches = passwordEncoder.matches(password, user.getPassword());

        if(matches) {
            return jwtService.generateToken(user);
        }

        return null;
    }

    private void encodePassword(User user){
        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
    }

}
