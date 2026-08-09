package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByEmployeeId(String employeeId);

    Optional<Faculty> findByEmail(String email);

    boolean existsByEmployeeId(String employeeId);

    boolean existsByEmail(String email);

    long countByDepartmentId(Long departmentId);

    List<Faculty> findByFirstNameContainingIgnoreCase(String firstName);

    List<Faculty> findByLastNameContainingIgnoreCase(String lastName);

    List<Faculty> findByEmployeeIdContainingIgnoreCase(String employeeId);

    List<Faculty> findByEmailContainingIgnoreCase(String email);

}