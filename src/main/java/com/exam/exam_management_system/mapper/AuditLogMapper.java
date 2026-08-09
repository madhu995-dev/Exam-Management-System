package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.AuditLogResponseDto;
import com.exam.exam_management_system.entity.AuditLog;
import org.springframework.stereotype.Component;

@Component
public class AuditLogMapper {

    public AuditLogResponseDto toDto(AuditLog auditLog) {

        return AuditLogResponseDto.builder()
                .id(auditLog.getId())
                .action(auditLog.getAction())
                .module(auditLog.getModule())
                .description(auditLog.getDescription())
                .userId(auditLog.getUser().getId())
                .username(auditLog.getUser().getUsername())
                .createdAt(auditLog.getCreatedAt())
                .build();

    }

}