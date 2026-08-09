package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.AuditLogRequestDto;
import com.exam.exam_management_system.dto.AuditLogResponseDto;

import java.util.List;

public interface AuditLogService {
    void logAction(
            Long userId,
            String action,
            String module,
            String description
    );

    AuditLogResponseDto createAuditLog(AuditLogRequestDto requestDto);

    List<AuditLogResponseDto> getAllAuditLogs();

    List<AuditLogResponseDto> getAuditLogsByUser(Long userId);

    List<AuditLogResponseDto> getAuditLogsByModule(String module);

    List<AuditLogResponseDto> getAuditLogsByAction(String action);

}