package com.findme.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor // Required for JPA
@AllArgsConstructor
public class Question {
    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_code", nullable = false)
    private Test test;

    private String body;

    @Column(name = "is_reverse")
    private boolean reverse;

    // Custom constructor for initial data
    public Question(String id, Test test, String body, boolean reverse) {
        this.id = id;
        this.test = test;
        this.body = body;
        this.reverse = reverse;
    }
}