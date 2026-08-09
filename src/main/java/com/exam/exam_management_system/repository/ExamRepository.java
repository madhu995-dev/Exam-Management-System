package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    Optional<Exam> findByExamCode(String examCode);

    boolean existsByExamCode(String examCode);

    long countBySubjectDepartmentId(Long departmentId);

    List<Exam> findByExamNameContainingIgnoreCase(String examName);

    List<Exam> findByExamCodeContainingIgnoreCase(String examCode);

}