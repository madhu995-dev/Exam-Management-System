package com.exam.exam_management_system.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequestDto {

    private String action;

    private String module;

    private String description;

    private Long userId;

}