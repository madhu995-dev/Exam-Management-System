package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.ResultRequestDto;
import com.exam.exam_management_system.dto.ResultResponseDto;

import java.util.List;

public interface ResultService {

    ResultResponseDto publishResult(ResultRequestDto requestDto);

    ResultResponseDto updateResult(
            Long resultId,
            ResultRequestDto requestDto
    );

    ResultResponseDto getResult(
            Long examId,
            Long studentId
    );

    List<ResultResponseDto> getResultsByExam(Long examId);

    List<ResultResponseDto> getResultsByStudent(Long studentId);

    void deleteResult(Long resultId);

}