package com.findme.backend.controller;

import com.findme.backend.filter.RequestIdFilter; // Import RequestIdFilter
import jakarta.servlet.http.HttpServletRequest; // Import HttpServletRequest
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_INSTANT;

    private Map<String, Object> buildErrorResponse(String code, String message, HttpServletRequest request) {
        return Map.of(
                "code", code,
                "message", message,
                "requestId", request.getHeader(RequestIdFilter.REQUEST_ID_HEADER),
                "timestamp", LocalDateTime.now().format(FORMATTER)
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> fieldError.getField() + ": " + (fieldError.getDefaultMessage() != null ? fieldError.getDefaultMessage() : "Invalid value"))
                .collect(Collectors.joining(", "));

        return new ResponseEntity<>(
                buildErrorResponse("VALIDATION_ERROR", "Invalid input provided: " + errors, request),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        return new ResponseEntity<>(
                buildErrorResponse("NOT_FOUND", ex.getMessage(), request),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex, HttpServletRequest request) {
        return new ResponseEntity<>(
                buildErrorResponse("INTERNAL_SERVER_ERROR", "An unexpected error occurred: " + ex.getMessage(), request),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}

