package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.FacultyRequestDto;
import com.exam.exam_management_system.dto.FacultyResponseDto;
import com.exam.exam_management_system.service.FacultyService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    // ===========================
    // CREATE FACULTY
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyResponseDto> createFaculty(
            @Valid @RequestBody FacultyRequestDto facultyRequestDto) {

        return new ResponseEntity<>(
                facultyService.createFaculty(facultyRequestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL FACULTIES
    // ADMIN ONLY
    // ===========================
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FacultyResponseDto>> getAllFaculties() {

        return ResponseEntity.ok(facultyService.getAllFaculties());
    }

    // ===========================
    // GET FACULTY BY ID
    // ADMIN ONLY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyResponseDto> getFacultyById(@PathVariable Long id) {

        return ResponseEntity.ok(facultyService.getFacultyById(id));
    }

    // ===========================
    // UPDATE FACULTY
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FacultyResponseDto> updateFaculty(
            @PathVariable Long id,
            @Valid @RequestBody FacultyRequestDto facultyRequestDto) {

        return ResponseEntity.ok(
                facultyService.updateFaculty(id, facultyRequestDto)
        );
    }

    // ===========================
    // DELETE FACULTY
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFaculty(@PathVariable Long id) {

        facultyService.deleteFaculty(id);

        return ResponseEntity.ok("Faculty deleted successfully.");
    }
}