package com.findme.backend.controller;

import com.findme.backend.auth.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getMyInfo(@AuthenticationPrincipal CustomOAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        return ResponseEntity.ok(Map.of(
                "id", String.valueOf(principal.getId()),
                "email", principal.getEmail(),
                "nickname", principal.getNickname()
        ));
    }
}
