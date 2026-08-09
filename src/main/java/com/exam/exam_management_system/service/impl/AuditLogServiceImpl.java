package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.AuditLogRequestDto;
import com.exam.exam_management_system.dto.AuditLogResponseDto;
import com.exam.exam_management_system.entity.AuditLog;
import com.exam.exam_management_system.entity.User;
import com.exam.exam_management_system.mapper.AuditLogMapper;
import com.exam.exam_management_system.repository.AuditLogRepository;
import com.exam.exam_management_system.repository.UserRepository;
import com.exam.exam_management_system.service.AuditLogService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final AuditLogMapper auditLogMapper;
    @Override
    public void logAction(Long userId,
                          String action,
                          String module,
                          String description) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .module(module)
                .description(description)
                .build();

        auditLogRepository.save(auditLog);

    }
    @Override
    public AuditLogResponseDto createAuditLog(AuditLogRequestDto requestDto) {

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        AuditLog auditLog = AuditLog.builder()
                .action(requestDto.getAction())
                .module(requestDto.getModule())
                .description(requestDto.getDescription())
                .user(user)
                .build();

        return auditLogMapper.toDto(
                auditLogRepository.save(auditLog)
        );

    }

    @Override
    public List<AuditLogResponseDto> getAllAuditLogs() {

        return auditLogRepository.findAll()
                .stream()
                .map(auditLogMapper::toDto)
                .toList();

    }

    @Override
    public List<AuditLogResponseDto> getAuditLogsByUser(Long userId) {

        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(auditLogMapper::toDto)
                .toList();

    }

    @Override
    public List<AuditLogResponseDto> getAuditLogsByModule(String module) {

        return auditLogRepository.findByModuleOrderByCreatedAtDesc(module)
                .stream()
                .map(auditLogMapper::toDto)
                .toList();

    }

    @Override
    public List<AuditLogResponseDto> getAuditLogsByAction(String action) {

        return auditLogRepository.findByActionOrderByCreatedAtDesc(action)
                .stream()
                .map(auditLogMapper::toDto)
                .toList();

    }
}