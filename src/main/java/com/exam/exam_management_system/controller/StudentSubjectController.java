package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.StudentSubjectRequestDto;
import com.exam.exam_management_system.dto.StudentSubjectResponseDto;
import com.exam.exam_management_system.service.StudentSubjectService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-subjects")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class StudentSubjectController {

    private final StudentSubjectService studentSubjectService;

    // ===========================
    // REGISTER STUDENT SUBJECT
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentSubjectResponseDto> registerStudentSubject(
            @Valid @RequestBody StudentSubjectRequestDto requestDto) {

        return new ResponseEntity<>(
                studentSubjectService.registerStudentSubject(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL REGISTRATIONS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<StudentSubjectResponseDto>> getAllStudentSubjects() {

        return ResponseEntity.ok(studentSubjectService.getAllStudentSubjects());
    }

    // ===========================
    // GET SUBJECTS OF A STUDENT
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<StudentSubjectResponseDto>> getSubjectsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                studentSubjectService.getSubjectsByStudent(studentId)
        );
    }

    // ===========================
    // GET STUDENTS OF A SUBJECT
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<StudentSubjectResponseDto>> getStudentsBySubject(
            @PathVariable Long subjectId) {

        return ResponseEntity.ok(
                studentSubjectService.getStudentsBySubject(subjectId)
        );
    }

    // ===========================
    // UNREGISTER STUDENT SUBJECT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> unregisterStudentSubject(
            @PathVariable Long id) {

        studentSubjectService.unregisterStudentSubject(id);

        return ResponseEntity.ok(
                "Student subject registration deleted successfully."
        );
    }
}