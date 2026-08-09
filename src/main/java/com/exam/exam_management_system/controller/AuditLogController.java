package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.AuditLogRequestDto;
import com.exam.exam_management_system.dto.AuditLogResponseDto;
import com.exam.exam_management_system.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<AuditLogResponseDto> createAuditLog(
            @RequestBody AuditLogRequestDto requestDto) {

        return new ResponseEntity<>(
                auditLogService.createAuditLog(requestDto),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<AuditLogResponseDto>> getAllAuditLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs()
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponseDto>> getAuditLogsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByUser(userId)
        );
    }

    @GetMapping("/module/{module}")
    public ResponseEntity<List<AuditLogResponseDto>> getAuditLogsByModule(
            @PathVariable String module) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByModule(module)
        );
    }

    @GetMapping("/action/{action}")
    public ResponseEntity<List<AuditLogResponseDto>> getAuditLogsByAction(
            @PathVariable String action) {

        return ResponseEntity.ok(
                auditLogService.getAuditLogsByAction(action)
        );
    }

}