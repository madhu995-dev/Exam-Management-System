package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.ExaminationSeriesRequestDto;
import com.exam.exam_management_system.dto.ExaminationSeriesResponseDto;
import com.exam.exam_management_system.entity.ExaminationSeries;
import org.springframework.stereotype.Component;

@Component
public class ExaminationSeriesMapper {

    public ExaminationSeries toEntity(ExaminationSeriesRequestDto dto) {

        return ExaminationSeries.builder()
                .seriesName(dto.getSeriesName())
                .description(dto.getDescription())
                .status(dto.getStatus())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();
    }

    public ExaminationSeriesResponseDto toResponseDto(ExaminationSeries series) {

        return ExaminationSeriesResponseDto.builder()
                .id(series.getId())
                .seriesName(series.getSeriesName())
                .description(series.getDescription())
                .status(series.getStatus())
                .startDate(series.getStartDate())
                .endDate(series.getEndDate())
                .createdAt(series.getCreatedAt())
                .updatedAt(series.getUpdatedAt())
                .build();
    }

    public void updateEntity(ExaminationSeries series,
                             ExaminationSeriesRequestDto dto) {

        series.setSeriesName(dto.getSeriesName());
        series.setDescription(dto.getDescription());
        series.setStatus(dto.getStatus());
        series.setStartDate(dto.getStartDate());
        series.setEndDate(dto.getEndDate());
    }
}