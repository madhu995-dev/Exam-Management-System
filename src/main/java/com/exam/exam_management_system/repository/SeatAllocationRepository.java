package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Seat;
import com.exam.exam_management_system.entity.SeatAllocation;
import com.exam.exam_management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatAllocationRepository extends JpaRepository<SeatAllocation, Long> {

    List<SeatAllocation> findByExamId(Long examId);

    List<SeatAllocation> findByStudentId(Long studentId);

    Optional<SeatAllocation> findByExamAndStudent(Exam exam, Student student);

    Optional<SeatAllocation> findByExamAndSeat(Exam exam, Seat seat);

    boolean existsByExamAndStudent(Exam exam, Student student);

    boolean existsByExamAndSeat(Exam exam, Seat seat);

    void deleteByExam(Exam exam);

}