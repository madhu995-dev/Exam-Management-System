package com.exam.exam_management_system.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSubjectResponseDto {

    private Long id;

    private Long studentId;

    private String studentName;

    private String rollNumber;

    private Long subjectId;

    private String subjectName;

    private String subjectCode;

    private LocalDateTime createdAt;

}