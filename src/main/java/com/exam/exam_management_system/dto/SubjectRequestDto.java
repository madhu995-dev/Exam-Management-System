package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.SubjectType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectRequestDto {

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    @NotNull(message = "Credits are required")
    @Min(value = 1, message = "Credits must be greater than 0")
    private Integer credits;

    @NotNull(message = "Subject type is required")
    private SubjectType subjectType;

    @NotNull(message = "Department ID is required")
    private Long departmentId;
}