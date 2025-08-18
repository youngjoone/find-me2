package com.findme.backend.service;

import com.findme.backend.dto.*;
import com.findme.backend.entity.Question;
import com.findme.backend.entity.Test;
import com.findme.backend.entity.ResultEntity; // Import ResultEntity
import com.findme.backend.repository.QuestionRepository;
import com.findme.backend.repository.TestRepository;
import com.findme.backend.repository.ResultRepository; // Import ResultRepository
import com.findme.backend.auth.CustomOAuth2User; // Import CustomOAuth2User
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder; // Import SecurityContextHolder
import org.springframework.security.core.Authentication; // Import Authentication

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;

    @PostConstruct
    @Transactional
    public void init() {
        // Check if test already exists to prevent re-insertion on every app restart
        if (testRepository.findByCode("trait_v1").isEmpty()) {
            Test test = new Test("trait_v1", "성향 테스트 v1", 1, LocalDateTime.now());
            testRepository.save(test);

            List<Question> questions = List.of(
                    new Question("Q1", test, "나는 새로운 사람들을 만나는 것을 즐긴다.", false),
                    new Question("Q2", test, "나는 혼자 시간을 보내면 에너지가 고갈된다.", true), // Reverse
                    new Question("Q3", test, "나는 대화의 중심에 있는 것을 좋아한다.", false),
                    new Question("Q4", test, "나는 계획을 세우고 따르는 것을 선호한다.", false),
                    new Question("Q5", test, "나는 즉흥적인 활동을 즐긴다.", false)
            );
            questionRepository.saveAll(questions);
        }
    }

    public Optional<TestResponseDto> getTestByCode(String testCode) {
        return testRepository.findByCode(testCode)
                .map(this::convertToTestResponseDto);
    }

    @Transactional
    public ResultDto calculateResult(String testCode, SubmissionDto submission) {
        Test test = testRepository.findByCode(testCode)
                .orElseThrow(() -> new IllegalArgumentException("Test not found: " + testCode));

        Map<String, Question> questionMap = questionRepository.findByTest(test).stream()
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

        // Save result to database
        Long userId = null;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomOAuth2User) {
            CustomOAuth2User principal = (CustomOAuth2User) authentication.getPrincipal();
            userId = principal.getId();
        }

        ResultEntity resultEntity = new ResultEntity(
            null, // ID will be generated
            userId,
            testCode,
            normalizedScore,
            // Convert traits map to JSON string
            traits.entrySet().stream()
                .map(entry -> "\"" + entry.getKey() + "\":" + entry.getValue())
                .collect(Collectors.joining(",", "{", "}")),
            submission.getPoem(), // Save the generated poem from submission
            LocalDateTime.now()
        );
        resultRepository.save(resultEntity);

        return new ResultDto(resultEntity.getId(), normalizedScore, traits);
    }

    private TestResponseDto convertToTestResponseDto(Test test) {
        // Fetch questions eagerly for DTO conversion
        List<QuestionDto> questionDtos = questionRepository.findByTest(test).stream()
                .map(q -> new QuestionDto(q.getId(), q.getBody()))
                .collect(Collectors.toList());
        return new TestResponseDto(test.getCode(), test.getTitle(), questionDtos);
    }
}
