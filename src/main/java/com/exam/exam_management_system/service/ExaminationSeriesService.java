package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.ExaminationSeriesRequestDto;
import com.exam.exam_management_system.dto.ExaminationSeriesResponseDto;

import java.util.List;

public interface ExaminationSeriesService {

    ExaminationSeriesResponseDto createSeries(ExaminationSeriesRequestDto requestDto);

    List<ExaminationSeriesResponseDto> getAllSeries();

    ExaminationSeriesResponseDto getSeriesById(Long id);

    ExaminationSeriesResponseDto updateSeries(Long id,
                                              ExaminationSeriesRequestDto requestDto);

    void deleteSeries(Long id);

}