package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.AttendanceRequestDto;
import com.exam.exam_management_system.dto.AttendanceResponseDto;
import com.exam.exam_management_system.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // ===========================
    // MARK ATTENDANCE
    // ADMIN, FACULTY
    // ===========================
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<AttendanceResponseDto> markAttendance(
            @RequestBody AttendanceRequestDto requestDto) {

        return new ResponseEntity<>(
                attendanceService.markAttendance(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // UPDATE ATTENDANCE
    // ADMIN, FACULTY
    // ===========================
    @PutMapping("/{attendanceId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<AttendanceResponseDto> updateAttendance(
            @PathVariable Long attendanceId,
            @RequestBody AttendanceRequestDto requestDto) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(attendanceId, requestDto)
        );
    }

    // ===========================
    // GET ATTENDANCE BY EXAM
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/exam/{examId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendanceByExam(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByExam(examId)
        );
    }

    // ===========================
    // GET ATTENDANCE BY STUDENT
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendanceByStudent(
            @PathVariable Long studentId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByStudent(studentId)
        );
    }

    // ===========================
    // GET ATTENDANCE BY FACULTY
    // ADMIN, FACULTY
    // ===========================
    @GetMapping("/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY')")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendanceByFaculty(
            @PathVariable Long facultyId) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByFaculty(facultyId)
        );
    }

    // ===========================
    // GET PRESENT STUDENTS
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/exam/{examId}/present")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<AttendanceResponseDto>> getPresentStudents(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                attendanceService.getPresentStudents(examId)
        );
    }

    // ===========================
    // GET ABSENT STUDENTS
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/exam/{examId}/absent")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<AttendanceResponseDto>> getAbsentStudents(
            @PathVariable Long examId) {

        return ResponseEntity.ok(
                attendanceService.getAbsentStudents(examId)
        );
    }

    // ===========================
    // DELETE ATTENDANCE
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{attendanceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAttendance(
            @PathVariable Long attendanceId) {

        attendanceService.deleteAttendance(attendanceId);

        return ResponseEntity.ok("Attendance deleted successfully.");
    }
}