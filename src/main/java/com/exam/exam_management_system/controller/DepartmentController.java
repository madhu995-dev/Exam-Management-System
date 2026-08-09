package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.DepartmentDTO;
import com.exam.exam_management_system.service.DepartmentService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@SecurityRequirement(name = "Bearer Authentication")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    // ===========================
    // CREATE DEPARTMENT
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DepartmentDTO addDepartment(@RequestBody DepartmentDTO departmentDTO) {
        return departmentService.addDepartment(departmentDTO);
    }

    // ===========================
    // GET ALL DEPARTMENTS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public List<DepartmentDTO> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    // ===========================
    // GET DEPARTMENT BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public DepartmentDTO getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id);
    }

    // ===========================
    // UPDATE DEPARTMENT
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DepartmentDTO updateDepartmentById(
            @PathVariable Long id,
            @RequestBody DepartmentDTO departmentDTO) {

        return departmentService.updateDepartment(id, departmentDTO);
    }

    // ===========================
    // DELETE DEPARTMENT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteDepartmentById(@PathVariable Long id) {

        departmentService.deleteDepartment(id);
        return "Department Deleted Successfully!";
    }
}