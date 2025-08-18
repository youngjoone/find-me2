package com.findme.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_defs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestDef {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private int version;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String status; // DRAFT, PUBLISHED, ARCHIVED

    @Column(columnDefinition = "CLOB") // For H2, TEXT in Postgres
    private String questions; // JSON string

    @Column(columnDefinition = "CLOB") // For H2, TEXT in Postgres
    private String scoring; // JSON string

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
