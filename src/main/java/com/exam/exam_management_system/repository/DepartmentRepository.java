package com.exam.exam_management_system.repository;

import com.exam.exam_management_system.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByDepartmentCode(String departmentCode);

    Department findByDepartmentCode(String departmentCode);

    List<Department> findByDepartmentNameContainingIgnoreCase(String departmentName);

    List<Department> findByDepartmentCodeContainingIgnoreCase(String departmentCode);

}