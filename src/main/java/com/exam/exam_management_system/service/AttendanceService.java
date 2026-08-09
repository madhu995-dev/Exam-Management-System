package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.AttendanceRequestDto;
import com.exam.exam_management_system.dto.AttendanceResponseDto;

import java.util.List;

public interface AttendanceService {

    AttendanceResponseDto markAttendance(
            AttendanceRequestDto requestDto
    );

    AttendanceResponseDto updateAttendance(
            Long attendanceId,
            AttendanceRequestDto requestDto
    );

    List<AttendanceResponseDto> getAttendanceByExam(Long examId);

    List<AttendanceResponseDto> getAttendanceByStudent(Long studentId);

    List<AttendanceResponseDto> getAttendanceByFaculty(Long facultyId);

    List<AttendanceResponseDto> getPresentStudents(Long examId);

    List<AttendanceResponseDto> getAbsentStudents(Long examId);

    void deleteAttendance(Long attendanceId);

}