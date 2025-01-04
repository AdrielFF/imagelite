package io.github.adrielff.imageliteapi.application.user;

import io.github.adrielff.imageliteapi.application.jwt.JwtService;
import io.github.adrielff.imageliteapi.domain.AccessToken;
import io.github.adrielff.imageliteapi.domain.entity.User;
import io.github.adrielff.imageliteapi.domain.exception.DuplicatedTupleException;
import io.github.adrielff.imageliteapi.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final UserMapper mapper;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<Object> save(@RequestBody UserDTO dto) {
        try {
            User user =  mapper.toUser(dto);
            service.save(user);

            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(DuplicatedTupleException e) {
            var errorResponse = Map.of("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
    }

    @PostMapping("/auth")
    public ResponseEntity<AccessToken> authenticate(@RequestBody CredentialsDTO credentials) {
        AccessToken token = service.authenticate(credentials.getEmail(), credentials.getPassword());

        if(token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(token);
    }
}
