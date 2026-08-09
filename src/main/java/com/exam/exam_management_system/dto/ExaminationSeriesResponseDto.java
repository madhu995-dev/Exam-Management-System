package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.SeriesStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExaminationSeriesResponseDto {

    private Long id;

    private String seriesName;

    private String description;

    private SeriesStatus status;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}