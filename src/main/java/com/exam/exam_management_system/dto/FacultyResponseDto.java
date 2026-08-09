package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.FacultyStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultyResponseDto {

    private Long id;

    private String employeeId;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private Long departmentId;

    private String departmentName;

    private FacultyStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}