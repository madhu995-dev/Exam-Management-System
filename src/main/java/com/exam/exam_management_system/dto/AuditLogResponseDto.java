package com.exam.exam_management_system.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponseDto {

    private Long id;

    private String action;

    private String module;

    private String description;

    private Long userId;

    private String username;

    private LocalDateTime createdAt;

}