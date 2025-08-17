package com.findme.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class Test {
    private String code;
    private String title;
    private List<Question> questions;
}
