package com.exam.exam_management_system.dto;

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
public class HallTicketResponseDto {

    private Long id;

    private String hallTicketNumber;

    // Student Details
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;

    // Exam Details
    private Long examId;
    private String examName;
    private String examCode;

    // Subject Details
    private Long subjectId;
    private String subjectName;
    private String subjectCode;

    // Exam Schedule
    private LocalDate examDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // Seat Details
    private Long seatId;
    private String seatNumber;
    private Integer rowNumber;
    private Integer columnNumber;

    // Room Details
    private Long roomId;
    private String roomNumber;

    // Block Details
    private Long blockId;
    private String blockName;

    private LocalDateTime generatedAt;
}