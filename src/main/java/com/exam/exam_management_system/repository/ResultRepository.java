package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Result;
import com.exam.exam_management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResultRepository extends JpaRepository<Result, Long> {

    Optional<Result> findByExamAndStudent(
            Exam exam,
            Student student
    );

    boolean existsByExamAndStudent(
            Exam exam,
            Student student
    );

    List<Result> findByExamId(Long examId);

    List<Result> findByStudentId(Long studentId);

    void deleteByExamId(Long examId);

    long countByPass(boolean pass);
    long countByStudentDepartmentIdAndPass(
            Long departmentId,
            boolean pass
    );
}