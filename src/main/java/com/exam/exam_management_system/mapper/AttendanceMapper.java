package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.AttendanceResponseDto;
import com.exam.exam_management_system.entity.Attendance;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceResponseDto toResponseDto(Attendance attendance) {

        AttendanceResponseDto dto = new AttendanceResponseDto();

        dto.setId(attendance.getId());

        // Student Details
        dto.setStudentId(attendance.getStudent().getId());
        dto.setStudentName(attendance.getStudent().getFirstName()+" "+attendance.getStudent().getLastName());
        dto.setRollNumber(attendance.getStudent().getRollNumber());

        if (attendance.getStudent().getDepartment() != null) {
            dto.setDepartmentName(
                    attendance.getStudent()
                            .getDepartment()
                            .getDepartmentName()
            );
        }

        // Exam Details
        dto.setExamId(attendance.getExam().getId());
        dto.setExamName(attendance.getExam().getExamName());
        dto.setExamCode(attendance.getExam().getExamCode());

        dto.setExamDate(attendance.getExam().getExamDate());
        dto.setStartTime(attendance.getExam().getStartTime());
        dto.setEndTime(attendance.getExam().getEndTime());

        // Faculty Details
        dto.setFacultyId(attendance.getFaculty().getId());
        dto.setFacultyName(attendance.getFaculty().getFirstName()+" "+attendance.getFaculty().getLastName());

        // Attendance
        dto.setAttendanceStatus(attendance.getAttendanceStatus());
        dto.setRemarks(attendance.getRemarks());
        dto.setMarkedAt(attendance.getMarkedAt());

        return dto;
    }
}