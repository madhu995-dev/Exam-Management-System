package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponseDto {

    private Long id;

    // Student Details
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;

    // Exam Details
    private Long examId;
    private String examName;
    private String examCode;

    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // Faculty Details
    private Long facultyId;
    private String facultyName;

    // Attendance
    private AttendanceStatus attendanceStatus;

    private String remarks;

    private LocalDateTime markedAt;

}