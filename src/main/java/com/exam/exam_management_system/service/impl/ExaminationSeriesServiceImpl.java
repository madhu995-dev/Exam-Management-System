package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.ExaminationSeriesRequestDto;
import com.exam.exam_management_system.dto.ExaminationSeriesResponseDto;
import com.exam.exam_management_system.entity.ExaminationSeries;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.ExaminationSeriesMapper;
import com.exam.exam_management_system.repository.ExaminationSeriesRepository;
import com.exam.exam_management_system.service.ExaminationSeriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationSeriesServiceImpl implements ExaminationSeriesService {

    private final ExaminationSeriesRepository examinationSeriesRepository;
    private final ExaminationSeriesMapper examinationSeriesMapper;

    @Override
    public ExaminationSeriesResponseDto createSeries(ExaminationSeriesRequestDto requestDto) {

        if (examinationSeriesRepository.existsBySeriesName(requestDto.getSeriesName())) {
            throw new IllegalArgumentException("Series name already exists.");
        }

        ExaminationSeries series = examinationSeriesMapper.toEntity(requestDto);

        ExaminationSeries savedSeries = examinationSeriesRepository.save(series);

        return examinationSeriesMapper.toResponseDto(savedSeries);
    }

    @Override
    public List<ExaminationSeriesResponseDto> getAllSeries() {

        return examinationSeriesRepository.findAll()
                .stream()
                .map(examinationSeriesMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExaminationSeriesResponseDto getSeriesById(Long id) {

        ExaminationSeries series = examinationSeriesRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Examination Series not found with id: " + id));

        return examinationSeriesMapper.toResponseDto(series);
    }

    @Override
    public ExaminationSeriesResponseDto updateSeries(Long id,
                                                     ExaminationSeriesRequestDto requestDto) {

        ExaminationSeries series = examinationSeriesRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Examination Series not found with id: " + id));

        if (!series.getSeriesName().equals(requestDto.getSeriesName())
                && examinationSeriesRepository.existsBySeriesName(requestDto.getSeriesName())) {
            throw new IllegalArgumentException("Series name already exists.");
        }

        examinationSeriesMapper.updateEntity(series, requestDto);

        ExaminationSeries updatedSeries = examinationSeriesRepository.save(series);

        return examinationSeriesMapper.toResponseDto(updatedSeries);
    }

    @Override
    public void deleteSeries(Long id) {

        ExaminationSeries series = examinationSeriesRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Examination Series not found with id: " + id));

        examinationSeriesRepository.delete(series);
    }
}