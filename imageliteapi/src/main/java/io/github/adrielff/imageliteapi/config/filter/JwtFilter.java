package io.github.adrielff.imageliteapi.config.filter;

import io.github.adrielff.imageliteapi.application.jwt.JwtService;
import io.github.adrielff.imageliteapi.domain.entity.User;
import io.github.adrielff.imageliteapi.domain.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter  {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String token = getTokenFromRequest(request);

        if(token != null) {
            try {
                String email = jwtService.getEmailFromToken(token);

                User user = userService.findByEmail(email);
                setUserAsAuthenticated(user);
            } catch (JwtException e) {
                log.error("Invalid token: {}", e.getMessage());
            } catch( Exception e) {
                log.error("Token validation error: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");

        if(authorization != null) {
            String[] authorizationParts = authorization.split(" ");
            if(authorizationParts.length == 2) {
                return authorizationParts[1];
            }
        }

        return null;
    }

    private void setUserAsAuthenticated(User user) {
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();

        var authenticated = UsernamePasswordAuthenticationToken.authenticated(
                userDetails, "",
                userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authenticated);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().contains("/v1/user");
    }
}
