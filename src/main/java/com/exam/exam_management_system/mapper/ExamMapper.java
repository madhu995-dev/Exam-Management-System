package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.ExamRequestDto;
import com.exam.exam_management_system.dto.ExamResponseDto;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.ExaminationSeries;
import com.exam.exam_management_system.entity.Subject;
import org.springframework.stereotype.Component;

@Component
public class ExamMapper {

    public Exam toEntity(ExamRequestDto dto,
                         ExaminationSeries series,
                         Subject subject) {

        return Exam.builder()
                .examName(dto.getExamName())
                .examCode(dto.getExamCode())
                .examinationSeries(series)
                .subject(subject)
                .examDate(dto.getExamDate())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .duration(dto.getDuration())
                .status(dto.getStatus())
                .build();
    }

    public ExamResponseDto toResponseDto(Exam exam) {

        return ExamResponseDto.builder()
                .id(exam.getId())
                .examName(exam.getExamName())
                .examCode(exam.getExamCode())
                .seriesId(exam.getExaminationSeries().getId())
                .seriesName(exam.getExaminationSeries().getSeriesName())
                .subjectId(exam.getSubject().getId())
                .subjectName(exam.getSubject().getSubjectName())
                .examDate(exam.getExamDate())
                .startTime(exam.getStartTime())
                .endTime(exam.getEndTime())
                .duration(exam.getDuration())
                .status(exam.getStatus())
                .createdAt(exam.getCreatedAt())
                .updatedAt(exam.getUpdatedAt())
                .build();
    }

    public void updateEntity(Exam exam,
                             ExamRequestDto dto,
                             ExaminationSeries series,
                             Subject subject) {

        exam.setExamName(dto.getExamName());
        exam.setExamCode(dto.getExamCode());
        exam.setExaminationSeries(series);
        exam.setSubject(subject);
        exam.setExamDate(dto.getExamDate());
        exam.setStartTime(dto.getStartTime());
        exam.setEndTime(dto.getEndTime());
        exam.setDuration(dto.getDuration());
        exam.setStatus(dto.getStatus());
    }
}