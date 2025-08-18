package com.findme.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestDefImportRequest {
    private String code;
    private String title;
    private int version;
    private String questions; // JSON string
    private String scoring; // JSON string
}
