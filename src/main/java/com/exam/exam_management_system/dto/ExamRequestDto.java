package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.ExamStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamRequestDto {

    @NotBlank(message = "Exam name is required")
    private String examName;

    @NotBlank(message = "Exam code is required")
    private String examCode;

    @NotNull(message = "Series Id is required")
    private Long seriesId;

    @NotNull(message = "Subject Id is required")
    private Long subjectId;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Duration is required")
    private Integer duration;

    private ExamStatus status;
}