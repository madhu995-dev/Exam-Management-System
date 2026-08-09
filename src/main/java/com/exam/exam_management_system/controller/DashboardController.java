package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.AdminDashboardResponseDto;
import com.exam.exam_management_system.dto.HodDashboardResponseDto;
import com.exam.exam_management_system.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
@RestController
@RequestMapping("/api/dashboard")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // ===========================
    // ADMIN DASHBOARD
    // ADMIN ONLY
    // ===========================
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardResponseDto> getAdminDashboard() {

        return ResponseEntity.ok(
                dashboardService.getAdminDashboard()
        );

    }

    /*
    // ===========================
    // HOD DASHBOARD
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/hod/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<HodDashboardResponseDto> getHodDashboard(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                dashboardService.getHodDashboard(departmentId)
        );

    }
    */

}