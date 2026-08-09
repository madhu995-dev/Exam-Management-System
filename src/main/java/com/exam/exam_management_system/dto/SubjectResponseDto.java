package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.SubjectType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponseDto {

    private Long id;

    private String subjectName;

    private String subjectCode;

    private Integer credits;

    private SubjectType subjectType;

    private Long departmentId;

    private String departmentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}