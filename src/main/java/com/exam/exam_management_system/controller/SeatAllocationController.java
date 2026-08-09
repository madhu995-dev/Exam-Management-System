package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.SeatAllocationResponseDto;
import com.exam.exam_management_system.service.SeatAllocationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seat-allocations")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class SeatAllocationController {

    private final SeatAllocationService seatAllocationService;

    // ===========================
    // ALLOCATE SEATS
    // ADMIN ONLY
    // ===========================
    @PostMapping("/{examId}/allocate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SeatAllocationResponseDto>> allocateSeats(
            @PathVariable Long examId) {

        System.out.println("Seat Allocation API Called");

        return new ResponseEntity<>(
                seatAllocationService.allocateSeats(examId),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALLOCATION BY EXAM
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<SeatAllocationResponseDto>> getAllocationByExam(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                seatAllocationService.getAllocationByExam(examId)
        );
    }

    // ===========================
    // GET ALLOCATION BY STUDENT
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<SeatAllocationResponseDto>> getAllocationByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                seatAllocationService.getAllocationByStudent(studentId)
        );
    }

    // ===========================
    // DELETE ALLOCATION
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/exam/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAllocation(
            @PathVariable Long examId) {

        seatAllocationService.deleteAllocation(examId);

        return ResponseEntity.ok("Seat allocations deleted successfully.");
    }
}