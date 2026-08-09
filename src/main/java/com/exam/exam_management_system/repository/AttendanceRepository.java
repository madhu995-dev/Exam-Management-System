package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Attendance;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.enums.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByExamAndStudent(Exam exam, Student student);

    boolean existsByExamAndStudent(Exam exam, Student student);

    List<Attendance> findByExamId(Long examId);

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByFacultyId(Long facultyId);

    List<Attendance> findByExamAndAttendanceStatus(
            Exam exam,
            AttendanceStatus attendanceStatus
    );

    long countByAttendanceStatus(AttendanceStatus attendanceStatus);

    long countByStudentDepartmentIdAndAttendanceStatus(
            Long departmentId,
            AttendanceStatus attendanceStatus
    );

}