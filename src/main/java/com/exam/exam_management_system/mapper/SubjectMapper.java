package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.SubjectRequestDto;
import com.exam.exam_management_system.dto.SubjectResponseDto;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Subject;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {

    public Subject toEntity(SubjectRequestDto dto, Department department) {

        return Subject.builder()
                .subjectName(dto.getSubjectName())
                .subjectCode(dto.getSubjectCode())
                .credits(dto.getCredits())
                .subjectType(dto.getSubjectType())
                .department(department)
                .build();
    }

    public SubjectResponseDto toResponseDto(Subject subject) {

        return SubjectResponseDto.builder()
                .id(subject.getId())
                .subjectName(subject.getSubjectName())
                .subjectCode(subject.getSubjectCode())
                .credits(subject.getCredits())
                .subjectType(subject.getSubjectType())
                .departmentId(subject.getDepartment().getId())
                .departmentName(subject.getDepartment().getDepartmentName())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }

    public void updateEntity(Subject subject,
                             SubjectRequestDto dto,
                             Department department) {

        subject.setSubjectName(dto.getSubjectName());
        subject.setSubjectCode(dto.getSubjectCode());
        subject.setCredits(dto.getCredits());
        subject.setSubjectType(dto.getSubjectType());
        subject.setDepartment(department);
    }
}