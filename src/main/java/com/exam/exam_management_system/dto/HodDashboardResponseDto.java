package com.exam.exam_management_system.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HodDashboardResponseDto {

    private String departmentName;

    private long totalStudents;

    private long totalFaculty;

    private long totalSubjects;

    private long totalExams;

    private long presentStudents;

    private long absentStudents;

    private long passStudents;

    private long failStudents;

    private double passPercentage;

    private double attendancePercentage;

}