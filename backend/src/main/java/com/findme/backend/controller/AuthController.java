package com.findme.backend.controller;

import com.findme.backend.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");

        // For development purposes, we'll just generate a token for a hardcoded user
        // In a real application, you would authenticate the user here
        // and retrieve their actual roles/authorities.
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("message", "Username cannot be empty"));
        }

        // Assuming a simple user for development
        // In a real app, fetch user details from DB
        String userId = "testUser"; // Or use the provided username
        String role = "ROLE_USER"; // Assign a default role

        String token = jwtProvider.generateToken(userId);

        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}
