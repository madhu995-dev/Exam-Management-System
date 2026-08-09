package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.InvigilatorAssignment;
import com.exam.exam_management_system.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvigilatorAssignmentRepository extends JpaRepository<InvigilatorAssignment, Long> {

    List<InvigilatorAssignment> findByExamId(Long examId);

    List<InvigilatorAssignment> findByFacultyId(Long facultyId);

    List<InvigilatorAssignment> findByRoomId(Long roomId);

    Optional<InvigilatorAssignment> findByExamAndFaculty(Exam exam, Faculty faculty);

    Optional<InvigilatorAssignment> findByExamAndRoom(Exam exam, Room room);

    boolean existsByExamAndFaculty(Exam exam, Faculty faculty);

    boolean existsByExamAndRoom(Exam exam, Room room);

    void deleteByExam(Exam exam);

}