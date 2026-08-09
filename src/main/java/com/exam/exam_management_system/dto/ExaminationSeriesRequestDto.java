package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.SeriesStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExaminationSeriesRequestDto {

    @NotBlank(message = "Series name is required")
    private String seriesName;

    private String description;

    private SeriesStatus status;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

}