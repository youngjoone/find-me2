package com.findme.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class ResultDto {
    private double score;
    private Map<String, Double> traits;
}
