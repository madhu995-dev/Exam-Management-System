package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.ExaminationSeriesRequestDto;
import com.exam.exam_management_system.dto.ExaminationSeriesResponseDto;
import com.exam.exam_management_system.service.ExaminationSeriesService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examination-series")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class ExaminationSeriesController {

    private final ExaminationSeriesService examinationSeriesService;

    // ===========================
    // CREATE EXAMINATION SERIES
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExaminationSeriesResponseDto> createSeries(
            @Valid @RequestBody ExaminationSeriesRequestDto requestDto) {

        return new ResponseEntity<>(
                examinationSeriesService.createSeries(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET ALL EXAMINATION SERIES
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<ExaminationSeriesResponseDto>> getAllSeries() {

        return ResponseEntity.ok(examinationSeriesService.getAllSeries());
    }

    // ===========================
    // GET EXAMINATION SERIES BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<ExaminationSeriesResponseDto> getSeriesById(
            @PathVariable Long id) {

        return ResponseEntity.ok(examinationSeriesService.getSeriesById(id));
    }

    // ===========================
    // UPDATE EXAMINATION SERIES
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExaminationSeriesResponseDto> updateSeries(
            @PathVariable Long id,
            @Valid @RequestBody ExaminationSeriesRequestDto requestDto) {

        return ResponseEntity.ok(
                examinationSeriesService.updateSeries(id, requestDto)
        );
    }

    // ===========================
    // DELETE EXAMINATION SERIES
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteSeries(@PathVariable Long id) {

        examinationSeriesService.deleteSeries(id);

        return ResponseEntity.ok("Examination Series deleted successfully.");
    }
}