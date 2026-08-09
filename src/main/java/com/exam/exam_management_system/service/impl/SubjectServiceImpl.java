package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.SubjectRequestDto;
import com.exam.exam_management_system.dto.SubjectResponseDto;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Subject;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.SubjectMapper;
import com.exam.exam_management_system.repository.DepartmentRepository;
import com.exam.exam_management_system.repository.SubjectRepository;
import com.exam.exam_management_system.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectMapper subjectMapper;

    @Override
    public SubjectResponseDto createSubject(SubjectRequestDto subjectRequestDto) {

        if (subjectRepository.existsBySubjectCode(subjectRequestDto.getSubjectCode())) {
            throw new IllegalArgumentException("Subject code already exists.");
        }

        Department department = departmentRepository.findById(subjectRequestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + subjectRequestDto.getDepartmentId()));

        Subject subject = subjectMapper.toEntity(subjectRequestDto, department);

        Subject savedSubject = subjectRepository.save(subject);

        return subjectMapper.toResponseDto(savedSubject);
    }

    @Override
    public List<SubjectResponseDto> getAllSubjects() {

        return subjectRepository.findAll()
                .stream()
                .map(subjectMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public SubjectResponseDto getSubjectById(Long id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subject not found with id: " + id));

        return subjectMapper.toResponseDto(subject);
    }

    @Override
    public SubjectResponseDto updateSubject(Long id,
                                            SubjectRequestDto subjectRequestDto) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subject not found with id: " + id));

        if (!subject.getSubjectCode().equals(subjectRequestDto.getSubjectCode())
                && subjectRepository.existsBySubjectCode(subjectRequestDto.getSubjectCode())) {

            throw new IllegalArgumentException("Subject code already exists.");
        }

        Department department = departmentRepository.findById(subjectRequestDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department not found with id: " + subjectRequestDto.getDepartmentId()));

        subjectMapper.updateEntity(subject, subjectRequestDto, department);

        Subject updatedSubject = subjectRepository.save(subject);

        return subjectMapper.toResponseDto(updatedSubject);
    }

    @Override
    public void deleteSubject(Long id) {

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subject not found with id: " + id));

        subjectRepository.delete(subject);
    }
}