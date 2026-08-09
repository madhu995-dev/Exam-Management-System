package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.FacultyRequestDto;
import com.exam.exam_management_system.dto.FacultyResponseDto;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.Role;
import com.exam.exam_management_system.entity.User;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.FacultyMapper;
import com.exam.exam_management_system.repository.DepartmentRepository;
import com.exam.exam_management_system.repository.FacultyRepository;
import com.exam.exam_management_system.repository.UserRepository;
import com.exam.exam_management_system.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final FacultyMapper facultyMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public FacultyResponseDto createFaculty(FacultyRequestDto facultyRequestDto) {

        if (facultyRepository.existsByEmployeeId(facultyRequestDto.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID already exists.");
        }

        if (facultyRepository.existsByEmail(facultyRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        Department department = departmentRepository.findById(facultyRequestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + facultyRequestDto.getDepartmentId()));

        Faculty faculty = facultyMapper.toEntity(facultyRequestDto, department);

        Faculty savedFaculty = facultyRepository.save(faculty);
        if (userRepository.existsByUsername(savedFaculty.getEmployeeId())) {
            throw new RuntimeException("User already exists");
        }
        User user = User.builder()
                .username(savedFaculty.getEmployeeId())
                .email(savedFaculty.getEmail())
                .password(passwordEncoder.encode("Faculty@123"))
                .role(Role.FACULTY)
                .enabled(true)
                .build();

        userRepository.save(user);

        return facultyMapper.toResponseDto(savedFaculty);
    }

    @Override
    public List<FacultyResponseDto> getAllFaculties() {

        return facultyRepository.findAll()
                .stream()
                .map(facultyMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public FacultyResponseDto getFacultyById(Long id) {

        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        return facultyMapper.toResponseDto(faculty);
    }

    @Override
    public FacultyResponseDto updateFaculty(Long id, FacultyRequestDto facultyRequestDto) {

        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        if (!faculty.getEmployeeId().equals(facultyRequestDto.getEmployeeId())
                && facultyRepository.existsByEmployeeId(facultyRequestDto.getEmployeeId())) {
            throw new IllegalArgumentException("Employee ID already exists.");
        }

        if (!faculty.getEmail().equals(facultyRequestDto.getEmail())
                && facultyRepository.existsByEmail(facultyRequestDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists.");
        }

        Department department = departmentRepository.findById(facultyRequestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + facultyRequestDto.getDepartmentId()));

        facultyMapper.updateEntity(faculty, facultyRequestDto, department);

        Faculty updatedFaculty = facultyRepository.save(faculty);

        return facultyMapper.toResponseDto(updatedFaculty);
    }

    @Override
    public void deleteFaculty(Long id) {

        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));

        facultyRepository.delete(faculty);
    }
}