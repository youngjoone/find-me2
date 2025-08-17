package com.findme.backend.controller;

import com.findme.backend.dto.PaginatedResponse;
import com.findme.backend.dto.ResultDetailDto;
import com.findme.backend.dto.ResultListItemDto;
import com.findme.backend.entity.ResultEntity;
import com.findme.backend.repository.ResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/results")
@RequiredArgsConstructor
public class ResultController {

    private final ResultRepository resultRepository;

    @GetMapping
    public ResponseEntity<PaginatedResponse<ResultListItemDto>> getResults(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ResultEntity> resultsPage = resultRepository.findAll(pageable);

        List<ResultListItemDto> items = resultsPage.getContent().stream()
                .map(result -> new ResultListItemDto(result.getId(), result.getTestCode(), result.getScore(), result.getCreatedAt()))
                .collect(Collectors.toList());

        String nextCursor = null;
        if (resultsPage.hasNext()) {
            nextCursor = String.valueOf(page + 1); // Simple page number as cursor
        }

        return ResponseEntity.ok(new PaginatedResponse<>(items, nextCursor));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultDetailDto> getResultDetail(@PathVariable Long id) {
        return resultRepository.findById(id)
                .map(result -> new ResultDetailDto(
                        result.getId(),
                        result.getTestCode(),
                        result.getScore(),
                        result.getTraits(), // JSON string
                        result.getPoem(),
                        result.getCreatedAt()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
