package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.SubjectRequestDto;
import com.exam.exam_management_system.dto.SubjectResponseDto;

import java.util.List;

public interface SubjectService {

    SubjectResponseDto createSubject(SubjectRequestDto subjectRequestDto);

    List<SubjectResponseDto> getAllSubjects();

    SubjectResponseDto getSubjectById(Long id);

    SubjectResponseDto updateSubject(Long id,
                                     SubjectRequestDto subjectRequestDto);

    void deleteSubject(Long id);

}