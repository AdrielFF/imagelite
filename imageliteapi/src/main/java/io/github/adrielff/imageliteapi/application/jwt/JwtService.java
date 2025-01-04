package io.github.adrielff.imageliteapi.application.jwt;

import io.github.adrielff.imageliteapi.domain.AccessToken;
import io.github.adrielff.imageliteapi.domain.entity.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {

    final static int TOKEN_EXPIRATION_MINUTES = 60;

    private final SecretKeyGenerator keyGenerator;

    public AccessToken generateToken(User user) {
        var key = keyGenerator.getKey();
        var expiration = generateExpirationDate();
        var claims = generateTokenClaims(user);

        String token = Jwts
                .builder()
                .signWith(key)
                .subject(user.getEmail())
                .expiration(expiration)
                .claims(claims)
                .compact();

        return new AccessToken(token);
    }

    private Date generateExpirationDate() {
        LocalDateTime now = LocalDateTime.now().plusMinutes(TOKEN_EXPIRATION_MINUTES);

        return Date.from(now.atZone(ZoneId.systemDefault()).toInstant());
    }

    private Map<String, Object> generateTokenClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        return claims;
    }

    public String getEmailFromToken(String tokenJwt) {
        try {
            return Jwts.parser()
                    .verifyWith(keyGenerator.getKey())
                    .build()
                    .parseSignedClaims(tokenJwt)
                    .getPayload()
                    .getSubject();
        }catch(JwtException e) {
            throw new InvalidTokenException(e.getMessage());
        }
    }
}
