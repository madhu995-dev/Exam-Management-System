package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.StudentDTO;
import com.exam.exam_management_system.service.StudentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "Bearer Authentication")
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ===========================
    // CREATE STUDENT
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public StudentDTO addStudent(@Valid @RequestBody StudentDTO studentDTO) {
        return studentService.addStudent(studentDTO);
    }

    // ===========================
    // GET ALL STUDENTS
    // ADMIN, FACULTY
    // ===========================
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public List<StudentDTO> getAllStudents() {
        return studentService.getAllStudents();
    }

    // ===========================
    // GET STUDENT BY ID
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public StudentDTO getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    // ===========================
    // UPDATE STUDENT
    // ADMIN ONLY
    // ===========================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public StudentDTO updateStudentDetailsById(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO studentDTO) {

        return studentService.updateStudent(id, studentDTO);
    }

    // ===========================
    // DELETE STUDENT
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteStudentById(@PathVariable Long id) {

        studentService.deleteStudent(id);
        return "Student Deleted Successfully !!!";
    }

    // ===========================
    // GET STUDENTS BY DEPARTMENT
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public List<StudentDTO> getStudentByDepartment(@PathVariable Long departmentId) {

        return studentService.getStudentByDepartmentId(departmentId);
    }

    // ===========================
    // GET STUDENT BY HALL TICKET
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/hallticket/{hallTicketNumber}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public StudentDTO getStudentByhallTicketNumber(@PathVariable String hallTicketNumber) {

        return studentService.getStudentByhallTicketNumber(hallTicketNumber);
    }

    // ===========================
    // GET STUDENT BY FIRST NAME
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/firstName/{firstName}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public List<StudentDTO> getStudentsByFirstName(@PathVariable String firstName) {

        return studentService.getStudentByFirstName(firstName);
    }

    // ===========================
    // PAGINATION
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/page")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public Page<StudentDTO> getAllStudents(
            @RequestParam int page,
            @RequestParam int size) {

        return studentService.getAllStudentsByPage(page, size);
    }

    // ===========================
    // SORTING
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/sort")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public List<StudentDTO> getAllStudentsSorted(
            @RequestParam String field,
            @RequestParam String direction) {

        return studentService.getAllStudentsSorted(field, direction);
    }
}