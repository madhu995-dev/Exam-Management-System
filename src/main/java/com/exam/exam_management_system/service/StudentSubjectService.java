package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.StudentSubjectRequestDto;
import com.exam.exam_management_system.dto.StudentSubjectResponseDto;

import java.util.List;

public interface StudentSubjectService {

    StudentSubjectResponseDto registerStudentSubject(StudentSubjectRequestDto requestDto);

    List<StudentSubjectResponseDto> getAllStudentSubjects();

    List<StudentSubjectResponseDto> getSubjectsByStudent(Long studentId);

    List<StudentSubjectResponseDto> getStudentsBySubject(Long subjectId);

    void unregisterStudentSubject(Long id);

}