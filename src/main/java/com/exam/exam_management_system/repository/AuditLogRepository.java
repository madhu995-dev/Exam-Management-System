package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<AuditLog> findByModuleOrderByCreatedAtDesc(String module);

    List<AuditLog> findByActionOrderByCreatedAtDesc(String action);

}