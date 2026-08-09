package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findBySubjectCode(String subjectCode);

    boolean existsBySubjectCode(String subjectCode);
    long countByDepartmentId(Long departmentId);
    List<Subject> findBySubjectNameContainingIgnoreCase(String keyword);

    List<Subject> findBySubjectCodeContainingIgnoreCase(String keyword);


}