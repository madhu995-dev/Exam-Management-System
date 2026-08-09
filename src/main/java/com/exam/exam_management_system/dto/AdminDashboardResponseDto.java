package com.exam.exam_management_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponseDto {

    private long totalDepartments;

    private long totalStudents;

    private long totalFaculty;

    private long totalBlocks;

    private long totalRooms;

    private long totalSubjects;

    private long totalExamSeries;

    private long totalExams;

    private long totalSeatAllocations;

    private long totalHallTickets;

    private long totalResults;

    private long presentStudents;

    private long absentStudents;

    private long passStudents;

    private long failStudents;

    private double passPercentage;

    private double failPercentage;

}