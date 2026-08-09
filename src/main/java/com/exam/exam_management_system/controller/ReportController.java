package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.service.ReportService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // ===========================
    // STUDENT REPORTS
    // ADMIN, FACULTY
    // ===========================

    @GetMapping("/students/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportStudentsPdf(HttpServletResponse response) {
        reportService.exportStudentsPdf(response);
    }

    @GetMapping("/students/excel")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportStudentsExcel(HttpServletResponse response) {
        reportService.exportStudentsExcel(response);
    }

    // ===========================
    // ATTENDANCE REPORTS
    // ADMIN, FACULTY
    // ===========================

    @GetMapping("/attendance/{examId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportAttendancePdf(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportAttendancePdf(examId, response);
    }

    @GetMapping("/attendance/{examId}/excel")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportAttendanceExcel(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportAttendanceExcel(examId, response);
    }

    // ===========================
    // RESULT REPORTS
    // ADMIN, FACULTY
    // ===========================

    @GetMapping("/results/{examId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportResultsPdf(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportResultsPdf(examId, response);
    }

    @GetMapping("/results/{examId}/excel")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportResultsExcel(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportResultsExcel(examId, response);
    }

    // ===========================
    // SEAT ALLOCATION REPORTS
    // ADMIN, FACULTY
    // ===========================

    @GetMapping("/seat-allocation/{examId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportSeatAllocationPdf(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportSeatAllocationPdf(examId, response);
    }

    @GetMapping("/seat-allocation/{examId}/excel")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportSeatAllocationExcel(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportSeatAllocationExcel(examId, response);
    }

    // ===========================
    // HALL TICKET REPORTS
    // ADMIN, FACULTY
    // ===========================

    @GetMapping("/hall-tickets/{examId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportHallTicketsPdf(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportHallTicketsPdf(examId, response);
    }

    // ===========================
    // INVIGILATOR REPORTS
    // ADMIN, FACULTY
    // ===========================

    @GetMapping("/invigilators/{examId}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public void exportInvigilatorPdf(
            @PathVariable Long examId,
            HttpServletResponse response) {

        reportService.exportInvigilatorPdf(examId, response);
    }
}