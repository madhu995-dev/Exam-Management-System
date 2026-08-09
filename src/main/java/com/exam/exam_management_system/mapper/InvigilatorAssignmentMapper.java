package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.InvigilatorAssignmentResponseDto;
import com.exam.exam_management_system.entity.InvigilatorAssignment;
import org.springframework.stereotype.Component;

@Component
public class InvigilatorAssignmentMapper {

    public InvigilatorAssignmentResponseDto toResponseDto(InvigilatorAssignment assignment) {

        InvigilatorAssignmentResponseDto dto = new InvigilatorAssignmentResponseDto();

        dto.setId(assignment.getId());

        // Exam Details
        dto.setExamId(assignment.getExam().getId());
        dto.setExamName(assignment.getExam().getExamName());
        dto.setExamCode(assignment.getExam().getExamCode());

        // Faculty Details
        dto.setFacultyId(assignment.getFaculty().getId());
        dto.setFacultyName(assignment.getFaculty().getFirstName()+" "+assignment.getFaculty().getLastName());
        dto.setEmployeeId(assignment.getFaculty().getEmployeeId());

        if (assignment.getFaculty().getDepartment() != null) {
            dto.setDepartmentName(
                    assignment.getFaculty()
                            .getDepartment()
                            .getDepartmentName()
            );
        }

        // Room Details
        dto.setRoomId(assignment.getRoom().getId());
        dto.setRoomNumber(assignment.getRoom().getRoomNumber());

        // Block Details
        dto.setBlockId(assignment.getRoom().getBlock().getId());
        dto.setBlockName(assignment.getRoom().getBlock().getBlockName());

        dto.setAssignedAt(assignment.getAssignedAt());

        return dto;
    }
}