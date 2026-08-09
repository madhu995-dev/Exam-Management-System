package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.DepartmentDTO;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.exception.DepartmentNotFoundException;
import com.exam.exam_management_system.repository.DepartmentRepository;
import com.exam.exam_management_system.service.DepartmentService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final ModelMapper modelMapper;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
                                  ModelMapper modelMapper){
        this.departmentRepository=departmentRepository;
        this.modelMapper=modelMapper;
    }

    @Override
    public DepartmentDTO addDepartment(DepartmentDTO departmentDTO) {
        if(departmentRepository.existsByDepartmentCode(departmentDTO.getDepartmentCode())){
            throw new RuntimeException("Department Code already exists . . .");
        }
        Department department=modelMapper.map(departmentDTO, Department.class);
        Department savedDepartment = departmentRepository.save(department);
        return modelMapper.map(savedDepartment, DepartmentDTO.class);
    }

    @Override
    public List<DepartmentDTO> getAllDepartments() {
        List<Department> departments=departmentRepository.findAll();
        return departments.stream()
                .map(department -> modelMapper.map(department, DepartmentDTO.class))
                .toList();
    }

    @Override
    public DepartmentDTO getDepartmentById(Long id) {
        Department department=departmentRepository.findById(id)
                .orElseThrow(()->
                        new DepartmentNotFoundException("Department not Found with id : "+id));
        return modelMapper.map(department, DepartmentDTO.class);
    }

    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department existingdepartment=departmentRepository.findById(id)
                .orElseThrow(()->
                        new DepartmentNotFoundException("Department not Found with id : "+id));
        Long existingId= existingdepartment.getId();
        modelMapper.map(departmentDTO,existingdepartment);
        existingdepartment.setId(existingId);
        Department updatedDepartment=departmentRepository.save(existingdepartment);
        return modelMapper.map(updatedDepartment, DepartmentDTO.class);
    }

    @Override
    public void deleteDepartment(Long id) {
        Department department=departmentRepository.findById(id)
                .orElseThrow(()->
                        new DepartmentNotFoundException("Department not found with id :"+id));
        departmentRepository.delete(department);
    }
}
