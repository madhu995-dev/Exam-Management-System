package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.ExamRequestDto;
import com.exam.exam_management_system.dto.ExamResponseDto;
import com.exam.exam_management_system.service.ExamService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class ExamController {

    private final ExamService examService;

    // ===========================
    // CREATE EXAM
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamResponseDto> createExam(
            @Valid @RequestBody ExamRequestDto requestDto) {

        return new ResponseEntity<>(
                examService.createExam(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL EXAMS
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<ExamResponseDto>> getAllExams() {

        return ResponseEntity.ok(examService.getAllExams());
    }

    // ===========================
    // GET EXAM BY ID
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<ExamResponseDto> getExamById(@PathVariable Long id) {

        return ResponseEntity.ok(examService.getExamById(id));
    }

    // ===========================
    // UPDATE EXAM
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamResponseDto> updateExam(
            @PathVariable Long id,
            @Valid @RequestBody ExamRequestDto requestDto) {

        return ResponseEntity.ok(
                examService.updateExam(id, requestDto)
        );
    }

    // ===========================
    // DELETE EXAM
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteExam(@PathVariable Long id) {

        examService.deleteExam(id);

        return ResponseEntity.ok("Exam deleted successfully.");
    }
}