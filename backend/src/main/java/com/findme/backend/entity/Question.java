package com.findme.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Question {
    private String id;
    private String body;
    private boolean reverse;
}
