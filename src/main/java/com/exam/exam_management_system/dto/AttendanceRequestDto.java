package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.AttendanceStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequestDto {

    private Long examId;

    private Long studentId;

    private Long facultyId;

    private AttendanceStatus attendanceStatus;

    private String remarks;

}