package com.findme.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestDefResponse {
    private Long id;
    private String code;
    private int version;
    private String title;
    private String status;
    private String questions; // JSON string
    private String scoring; // JSON string
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
