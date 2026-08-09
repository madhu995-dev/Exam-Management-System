package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.StudentSubjectRequestDto;
import com.exam.exam_management_system.dto.StudentSubjectResponseDto;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.entity.StudentSubject;
import com.exam.exam_management_system.entity.Subject;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.StudentSubjectMapper;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.repository.StudentSubjectRepository;
import com.exam.exam_management_system.repository.SubjectRepository;
import com.exam.exam_management_system.service.StudentSubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentSubjectServiceImpl implements StudentSubjectService {

    private final StudentSubjectRepository studentSubjectRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final StudentSubjectMapper studentSubjectMapper;

    @Override
    public StudentSubjectResponseDto registerStudentSubject(StudentSubjectRequestDto requestDto) {

        Student student = studentRepository.findById(requestDto.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Student not found with id: " + requestDto.getStudentId()));

        Subject subject = subjectRepository.findById(requestDto.getSubjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Subject not found with id: " + requestDto.getSubjectId()));

        if (studentSubjectRepository.existsByStudentAndSubject(student, subject)) {
            throw new IllegalArgumentException("Student is already registered for this subject.");
        }

        StudentSubject studentSubject = studentSubjectMapper.toEntity(student, subject);

        return studentSubjectMapper.toResponseDto(studentSubjectRepository.save(studentSubject));
    }

    @Override
    public List<StudentSubjectResponseDto> getAllStudentSubjects() {

        return studentSubjectRepository.findAll()
                .stream()
                .map(studentSubjectMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentSubjectResponseDto> getSubjectsByStudent(Long studentId) {

        return studentSubjectRepository.findByStudentId(studentId)
                .stream()
                .map(studentSubjectMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentSubjectResponseDto> getStudentsBySubject(Long subjectId) {

        return studentSubjectRepository.findBySubjectId(subjectId)
                .stream()
                .map(studentSubjectMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void unregisterStudentSubject(Long id) {

        StudentSubject studentSubject = studentSubjectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Registration not found with id: " + id));

        studentSubjectRepository.delete(studentSubject);
    }
}