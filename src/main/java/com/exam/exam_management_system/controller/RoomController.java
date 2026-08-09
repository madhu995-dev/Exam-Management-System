package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.RoomRequestDto;
import com.exam.exam_management_system.dto.RoomResponseDto;
import com.exam.exam_management_system.service.RoomService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // ===========================
    // CREATE ROOM
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponseDto> createRoom(
            @Valid @RequestBody RoomRequestDto roomRequestDto) {

        System.out.println("========== INSIDE ROOM CONTROLLER ==========");

        return new ResponseEntity<>(
                roomService.createRoom(roomRequestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL ROOMS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<RoomResponseDto>> getAllRooms() {

        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // ===========================
    // GET ROOM BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<RoomResponseDto> getRoomById(@PathVariable Long id) {

        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    // ===========================
    // UPDATE ROOM
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoomResponseDto> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequestDto roomRequestDto) {

        return ResponseEntity.ok(
                roomService.updateRoom(id, roomRequestDto)
        );
    }

    // ===========================
    // DELETE ROOM
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {

        roomService.deleteRoom(id);

        return ResponseEntity.ok("Room deleted successfully.");
    }
}