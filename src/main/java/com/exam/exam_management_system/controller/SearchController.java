package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.SearchResponseDto;
import com.exam.exam_management_system.service.SearchService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/students")
    public ResponseEntity<List<SearchResponseDto>> searchStudents(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                searchService.searchStudents(keyword)
        );
    }

    @GetMapping("/faculties")
    public ResponseEntity<List<SearchResponseDto>> searchFaculties(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                searchService.searchFaculties(keyword)
        );
    }

    @GetMapping("/departments")
    public ResponseEntity<List<SearchResponseDto>> searchDepartments(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                searchService.searchDepartments(keyword)
        );
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<SearchResponseDto>> searchSubjects(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                searchService.searchSubjects(keyword)
        );
    }

    @GetMapping("/exams")
    public ResponseEntity<List<SearchResponseDto>> searchExams(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                searchService.searchExams(keyword)
        );
    }
}