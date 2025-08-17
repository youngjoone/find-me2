package com.findme.backend.service;

import com.findme.backend.dto.*;
import com.findme.backend.entity.Question;
import com.findme.backend.entity.Test;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class TestService {

    private final Map<String, Test> testStore = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        List<Question> questions = List.of(
                new Question("Q1", "나는 새로운 사람들을 만나는 것을 즐긴다.", false),
                new Question("Q2", "나는 혼자 시간을 보내면 에너지가 고갈된다.", true), // Reverse
                new Question("Q3", "나는 대화의 중심에 있는 것을 좋아한다.", false),
                new Question("Q4", "나는 계획을 세우고 따르는 것을 선호한다.", false),
                new Question("Q5", "나는 즉흥적인 활동을 즐긴다.", false)
        );
        Test test = new Test("trait_v1", "성향 테스트 v1", questions);
        testStore.put(test.getCode(), test);
    }

    public Optional<TestResponseDto> getTestByCode(String testCode) {
        return Optional.ofNullable(testStore.get(testCode)).map(this::convertToTestResponseDto);
    }

    public ResultDto calculateResult(String testCode, SubmissionDto submission) {
        Test test = testStore.get(testCode);
        if (test == null) {
            throw new IllegalArgumentException("Test not found: " + testCode);
        }

        Map<String, Question> questionMap = test.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        double totalScore = 0;
        for (AnswerDto answer : submission.getAnswers()) {
            Question question = questionMap.get(answer.getQuestionId());
            if (question != null) {
                int value = answer.getValue();
                totalScore += question.isReverse() ? (6 - value) : value;
            }
        }

        double averageScore = totalScore / submission.getAnswers().size();
        
        // Normalize score to 0-100
        // Min possible avg is 1, max is 5. So range is 4.
        double normalizedScore = ((averageScore - 1) / 4.0) * 100;

        // Dummy trait calculation
        Map<String, Double> traits = Map.of(
                "A", normalizedScore * 0.9,
                "B", 100 - (normalizedScore * 0.5),
                "C", (totalScore / (test.getQuestions().size() * 5)) * 100 * 1.2
        );

        return new ResultDto(normalizedScore, traits);
    }

    private TestResponseDto convertToTestResponseDto(Test test) {
        List<QuestionDto> questionDtos = test.getQuestions().stream()
                .map(q -> new QuestionDto(q.getId(), q.getBody()))
                .collect(Collectors.toList());
        return new TestResponseDto(test.getCode(), test.getTitle(), questionDtos);
    }
}
