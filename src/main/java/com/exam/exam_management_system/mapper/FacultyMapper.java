package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.FacultyRequestDto;
import com.exam.exam_management_system.dto.FacultyResponseDto;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Faculty;
import org.springframework.stereotype.Component;

@Component
public class FacultyMapper {

    public Faculty toEntity(FacultyRequestDto dto, Department department) {

        return Faculty.builder()
                .employeeId(dto.getEmployeeId())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .department(department)
                .status(dto.getStatus())
                .build();
    }

    public FacultyResponseDto toResponseDto(Faculty faculty) {

        return FacultyResponseDto.builder()
                .id(faculty.getId())
                .employeeId(faculty.getEmployeeId())
                .firstName(faculty.getFirstName())
                .lastName(faculty.getLastName())
                .email(faculty.getEmail())
                .phoneNumber(faculty.getPhoneNumber())
                .departmentId(faculty.getDepartment().getId())
                .departmentName(faculty.getDepartment().getDepartmentName())
                .status(faculty.getStatus())
                .createdAt(faculty.getCreatedAt())
                .updatedAt(faculty.getUpdatedAt())
                .build();
    }

    public void updateEntity(Faculty faculty, FacultyRequestDto dto, Department department) {

        faculty.setEmployeeId(dto.getEmployeeId());
        faculty.setFirstName(dto.getFirstName());
        faculty.setLastName(dto.getLastName());
        faculty.setEmail(dto.getEmail());
        faculty.setPhoneNumber(dto.getPhoneNumber());
        faculty.setDepartment(department);
        faculty.setStatus(dto.getStatus());
    }
}