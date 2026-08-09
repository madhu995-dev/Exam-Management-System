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
public class ResultResponseDto {

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

    // Marks
    private Integer internalMarks;
    private Integer externalMarks;
    private Integer practicalMarks;

    private Integer totalMarks;

    private Double percentage;

    private String grade;

    private Boolean pass;

    private String remarks;

    private LocalDateTime publishedAt;

}