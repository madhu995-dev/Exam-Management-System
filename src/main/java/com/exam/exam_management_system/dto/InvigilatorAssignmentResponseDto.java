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
public class InvigilatorAssignmentResponseDto {

    private Long id;

    // Exam Details
    private Long examId;
    private String examName;
    private String examCode;

    // Faculty Details
    private Long facultyId;
    private String facultyName;
    private String employeeId;
    private String departmentName;

    // Room Details
    private Long roomId;
    private String roomNumber;

    // Block Details
    private Long blockId;
    private String blockName;

    private LocalDateTime assignedAt;

}