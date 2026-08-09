package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.HallTicket;
import com.exam.exam_management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HallTicketRepository extends JpaRepository<HallTicket, Long> {

    Optional<HallTicket> findByHallTicketNumber(String hallTicketNumber);

    Optional<HallTicket> findByStudentAndExam(Student student, Exam exam);

    List<HallTicket> findByStudentId(Long studentId);

    List<HallTicket> findByExamId(Long examId);

    boolean existsByStudentAndExam(Student student, Exam exam);

    void deleteByExam(Exam exam);

}