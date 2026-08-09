package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.StudentSubjectRequestDto;
import com.exam.exam_management_system.dto.StudentSubjectResponseDto;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.entity.StudentSubject;
import com.exam.exam_management_system.entity.Subject;
import org.springframework.stereotype.Component;

@Component
public class StudentSubjectMapper {

    public StudentSubject toEntity(Student student,
                                   Subject subject) {

        return StudentSubject.builder()
                .student(student)
                .subject(subject)
                .build();
    }

    public StudentSubjectResponseDto toResponseDto(StudentSubject studentSubject) {

        return StudentSubjectResponseDto.builder()
                .id(studentSubject.getId())
                .studentId(studentSubject.getStudent().getId())
                .studentName(studentSubject.getStudent().getFirstName() + " " +
                        studentSubject.getStudent().getLastName())
                .rollNumber(studentSubject.getStudent().getRollNumber())
                .subjectId(studentSubject.getSubject().getId())
                .subjectName(studentSubject.getSubject().getSubjectName())
                .subjectCode(studentSubject.getSubject().getSubjectCode())
                .createdAt(studentSubject.getCreatedAt())
                .build();
    }
}