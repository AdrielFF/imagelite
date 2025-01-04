package io.github.adrielff.imageliteapi.application.user;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
}
