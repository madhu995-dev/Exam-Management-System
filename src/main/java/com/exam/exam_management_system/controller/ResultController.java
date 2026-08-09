package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.ResultRequestDto;
import com.exam.exam_management_system.dto.ResultResponseDto;
import com.exam.exam_management_system.service.ResultService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class ResultController {

    private final ResultService resultService;

    // ===========================
    // PUBLISH RESULT
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponseDto> publishResult(
            @RequestBody ResultRequestDto requestDto) {

        return new ResponseEntity<>(
                resultService.publishResult(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // UPDATE RESULT
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultResponseDto> updateResult(
            @PathVariable Long resultId,
            @RequestBody ResultRequestDto requestDto) {

        return ResponseEntity.ok(
                resultService.updateResult(resultId, requestDto)
        );
    }

    // ===========================
    // GET RESULT OF A STUDENT
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/exam/{examId}/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<ResultResponseDto> getResult(
            @PathVariable Long examId,
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                resultService.getResult(examId, studentId)
        );
    }

    // ===========================
    // GET RESULTS BY EXAM
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<ResultResponseDto>> getResultsByExam(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                resultService.getResultsByExam(examId)
        );
    }

    // ===========================
    // GET RESULTS BY STUDENT
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<ResultResponseDto>> getResultsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                resultService.getResultsByStudent(studentId)
        );
    }

    // ===========================
    // DELETE RESULT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{resultId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteResult(
            @PathVariable Long resultId) {

        resultService.deleteResult(resultId);

        return ResponseEntity.ok("Result deleted successfully.");
    }
}