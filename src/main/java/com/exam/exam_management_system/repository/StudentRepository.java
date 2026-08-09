package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    List<Student> findByDepartmentId(Long departmentId);

    Optional<Student> findByHallTicketNumber(String hallTicketNumber);

    List<Student> findStudentByFirstName(String firstName);

    long countByDepartmentId(Long departmentId);

    List<Student> findByFirstNameContainingIgnoreCase(String firstName);

    List<Student> findByLastNameContainingIgnoreCase(String lastName);

    List<Student> findByRollNumberContainingIgnoreCase(String rollNumber);

    List<Student> findByEmailContainingIgnoreCase(String email);
    Optional<Student> findByRollNumber(String rollNumber);

}