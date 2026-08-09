package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.DepartmentDTO;

import java.util.List;

public interface DepartmentService {
    DepartmentDTO addDepartment(DepartmentDTO departmentDTO);
    List<DepartmentDTO> getAllDepartments();
    DepartmentDTO getDepartmentById(Long id);
    DepartmentDTO updateDepartment(Long id,DepartmentDTO departmentDTO);
    void deleteDepartment(Long id);
}
