package com.findme.backend.filter;

import com.findme.backend.util.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Import Slf4j
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j // Add Slf4j annotation
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String subject = null;

        log.debug("Processing request for URI: {}", request.getRequestURI()); // Log URI

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("No Bearer token found in Authorization header for URI: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return; // Important: return early if no token
        }

        token = authHeader.substring(7);
        log.debug("Bearer token found for URI: {}. Token: {}...", request.getRequestURI(), token.substring(0, Math.min(token.length(), 10))); // Log token snippet

        try {
            subject = jwtProvider.extractSubject(token);
            log.debug("Subject extracted: {}", subject);
        } catch (Exception e) {
            log.warn("Invalid JWT token for URI: {}. Error: {}", request.getRequestURI(), e.getMessage());
            // Do not set authentication, let subsequent filters handle 401
        }

        if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtProvider.validateToken(token)) {
                log.debug("JWT token is valid for subject: {}", subject);
                // For simplicity, we are creating a UserDetails object directly.
                // In a real application, you would load UserDetails from a UserDetailsService.
                UserDetails userDetails = new User(subject, "", new ArrayList<>());
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                log.debug("Authentication set for subject: {}", subject);
            } else {
                log.warn("JWT token validation failed for subject: {}", subject);
            }
        } else if (subject == null) {
            log.debug("Subject is null after extraction or token is invalid.");
        } else {
            log.debug("SecurityContext already has authentication for subject: {}", SecurityContextHolder.getContext().getAuthentication().getName());
        }
        filterChain.doFilter(request, response);
    }
}