package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.ExamRequestDto;
import com.exam.exam_management_system.dto.ExamResponseDto;

import java.util.List;

public interface ExamService {

    ExamResponseDto createExam(ExamRequestDto requestDto);

    List<ExamResponseDto> getAllExams();

    ExamResponseDto getExamById(Long id);

    ExamResponseDto updateExam(Long id, ExamRequestDto requestDto);

    void deleteExam(Long id);

}