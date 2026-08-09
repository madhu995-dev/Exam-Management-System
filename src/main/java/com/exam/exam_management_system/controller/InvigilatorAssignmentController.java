package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.InvigilatorAssignmentRequestDto;
import com.exam.exam_management_system.dto.InvigilatorAssignmentResponseDto;
import com.exam.exam_management_system.service.InvigilatorAssignmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invigilator-assignments")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class InvigilatorAssignmentController {

    private final InvigilatorAssignmentService assignmentService;

    // ===========================
    // ASSIGN INVIGILATOR
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InvigilatorAssignmentResponseDto> assignInvigilator(
            @RequestBody InvigilatorAssignmentRequestDto requestDto) {

        return new ResponseEntity<>(
                assignmentService.assignInvigilator(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ASSIGNMENTS BY EXAM
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<InvigilatorAssignmentResponseDto>> getAssignmentsByExam(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByExam(examId)
        );
    }

    // ===========================
    // GET ASSIGNMENTS BY FACULTY
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<InvigilatorAssignmentResponseDto>> getAssignmentsByFaculty(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByFaculty(facultyId)
        );
    }

    // ===========================
    // GET ASSIGNMENTS BY ROOM
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/room/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<InvigilatorAssignmentResponseDto>> getAssignmentsByRoom(
            @PathVariable Long roomId) {

        return ResponseEntity.ok(
                assignmentService.getAssignmentsByRoom(roomId)
        );
    }

    // ===========================
    // DELETE ASSIGNMENT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{assignmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAssignment(
            @PathVariable Long assignmentId) {

        assignmentService.deleteAssignment(assignmentId);

        return ResponseEntity.ok("Invigilator assignment deleted successfully.");
    }
}