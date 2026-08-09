package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.SeatRequestDto;
import com.exam.exam_management_system.dto.SeatResponseDto;
import com.exam.exam_management_system.service.SeatService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    // ===========================
    // CREATE SEAT
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SeatResponseDto> createSeat(
            @Valid @RequestBody SeatRequestDto requestDto) {

        return new ResponseEntity<>(
                seatService.createSeat(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL SEATS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<SeatResponseDto>> getAllSeats() {

        return ResponseEntity.ok(seatService.getAllSeats());
    }

    // ===========================
    // GET SEAT BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<SeatResponseDto> getSeatById(@PathVariable Long id) {

        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    // ===========================
    // GET SEATS BY ROOM
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/room/{roomId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<SeatResponseDto>> getSeatsByRoom(
            @PathVariable Long roomId) {

        return ResponseEntity.ok(seatService.getSeatsByRoom(roomId));
    }

    // ===========================
    // UPDATE SEAT
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SeatResponseDto> updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody SeatRequestDto requestDto) {

        return ResponseEntity.ok(
                seatService.updateSeat(id, requestDto)
        );
    }

    // ===========================
    // DELETE SEAT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSeat(@PathVariable Long id) {

        seatService.deleteSeat(id);

        return ResponseEntity.ok("Seat deleted successfully.");
    }
}