package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.ExamStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamResponseDto {

    private Long id;

    private String examName;

    private String examCode;

    private Long seriesId;

    private String seriesName;

    private Long subjectId;

    private String subjectName;

    private LocalDate examDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer duration;

    private ExamStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}