package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.SubjectRequestDto;
import com.exam.exam_management_system.dto.SubjectResponseDto;
import com.exam.exam_management_system.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class SubjectController {

    private final SubjectService subjectService;

    // ===========================
    // CREATE SUBJECT
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponseDto> createSubject(
            @Valid @RequestBody SubjectRequestDto subjectRequestDto) {

        return new ResponseEntity<>(
                subjectService.createSubject(subjectRequestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL SUBJECTS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<SubjectResponseDto>> getAllSubjects() {

        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    // ===========================
    // GET SUBJECT BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<SubjectResponseDto> getSubjectById(@PathVariable Long id) {

        return ResponseEntity.ok(subjectService.getSubjectById(id));
    }

    // ===========================
    // UPDATE SUBJECT
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubjectResponseDto> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequestDto subjectRequestDto) {

        return ResponseEntity.ok(
                subjectService.updateSubject(id, subjectRequestDto)
        );
    }

    // ===========================
    // DELETE SUBJECT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSubject(@PathVariable Long id) {

        subjectService.deleteSubject(id);

        return ResponseEntity.ok("Subject deleted successfully.");
    }
}