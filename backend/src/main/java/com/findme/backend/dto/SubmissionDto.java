package com.findme.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class SubmissionDto {
    @NotEmpty
    @Valid
    private List<AnswerDto> answers;

    private String poem; // Added poem field
}