package com.exam.exam_management_system.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentSubjectRequestDto {

    @NotNull(message = "Student Id is required")
    private Long studentId;

    @NotNull(message = "Subject Id is required")
    private Long subjectId;

}