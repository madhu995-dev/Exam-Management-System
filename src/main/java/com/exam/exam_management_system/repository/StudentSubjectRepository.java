package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.entity.StudentSubject;
import com.exam.exam_management_system.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentSubjectRepository extends JpaRepository<StudentSubject, Long> {

    boolean existsByStudentAndSubject(Student student, Subject subject);

    Optional<StudentSubject> findByStudentAndSubject(Student student, Subject subject);

    List<StudentSubject> findByStudentId(Long studentId);

    List<StudentSubject> findBySubjectId(Long subjectId);

}