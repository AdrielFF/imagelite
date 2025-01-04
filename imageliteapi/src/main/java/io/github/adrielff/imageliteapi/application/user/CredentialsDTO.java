package io.github.adrielff.imageliteapi.application.user;

import lombok.Data;

@Data
public class CredentialsDTO {
    private String email;
    private String password;
}
