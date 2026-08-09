package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.HallTicketResponseDto;
import com.exam.exam_management_system.service.HallTicketService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hall-tickets")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class HallTicketController {

    private final HallTicketService hallTicketService;

    // ===========================
    // GENERATE HALL TICKET FOR ONE STUDENT
    // ADMIN ONLY
    // ===========================
    @PostMapping("/generate/{examId}/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HallTicketResponseDto> generateHallTicket(
            @PathVariable Long examId,
            @PathVariable Long studentId) {

        return new ResponseEntity<>(
                hallTicketService.generateHallTicket(examId, studentId),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GENERATE HALL TICKETS FOR ALL STUDENTS
    // ADMIN ONLY
    // ===========================
    @PostMapping("/generate/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<HallTicketResponseDto>> generateHallTickets(
            @PathVariable Long examId) {

        return new ResponseEntity<>(
                hallTicketService.generateHallTickets(examId),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET HALL TICKETS BY EXAM
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<HallTicketResponseDto>> getHallTicketsByExam(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                hallTicketService.getHallTicketsByExam(examId)
        );
    }

    // ===========================
    // GET HALL TICKETS OF A STUDENT
    // ADMIN, STUDENT
    // ===========================
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','STUDENT')")
    public ResponseEntity<List<HallTicketResponseDto>> getHallTicketsByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                hallTicketService.getHallTicketsByStudent(studentId)
        );
    }

    // ===========================
    // GET HALL TICKET BY NUMBER
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/{hallTicketNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<HallTicketResponseDto> getHallTicket(
            @PathVariable String hallTicketNumber) {

        return ResponseEntity.ok(
                hallTicketService.getHallTicket(hallTicketNumber)
        );
    }
}