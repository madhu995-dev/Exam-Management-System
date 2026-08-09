package com.exam.exam_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SeatAllocationResponseDto {

    private Long id;

    // Exam Details
    private Long examId;
    private String examName;
    private String examCode;

    // Student Details
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String departmentName;

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

    private LocalDateTime allocatedAt;
}