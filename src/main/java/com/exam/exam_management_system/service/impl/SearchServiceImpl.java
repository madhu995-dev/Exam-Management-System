package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.SearchResponseDto;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.entity.Subject;
import com.exam.exam_management_system.mapper.SearchMapper;
import com.exam.exam_management_system.repository.DepartmentRepository;
import com.exam.exam_management_system.repository.ExamRepository;
import com.exam.exam_management_system.repository.FacultyRepository;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.repository.SubjectRepository;
import com.exam.exam_management_system.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final DepartmentRepository departmentRepository;
    private final SubjectRepository subjectRepository;
    private final ExamRepository examRepository;
    private final SearchMapper searchMapper;

    @Override
    public List<SearchResponseDto> searchStudents(String keyword) {

        return studentRepository.findByFirstNameContainingIgnoreCase(keyword)
                .stream()
                .map(student -> searchMapper.build(
                        student.getId(),
                        student.getFirstName() + " " + student.getLastName(),
                        student.getRollNumber(),
                        "Student"
                ))
                .toList();
    }

    @Override
    public List<SearchResponseDto> searchFaculties(String keyword) {

        return facultyRepository.findByFirstNameContainingIgnoreCase(keyword)
                .stream()
                .map(faculty -> searchMapper.build(
                        faculty.getId(),
                        faculty.getFirstName() + " " + faculty.getLastName(),
                        faculty.getEmployeeId(),
                        "Faculty"
                ))
                .toList();
    }

    @Override
    public List<SearchResponseDto> searchDepartments(String keyword) {

        return departmentRepository.findByDepartmentNameContainingIgnoreCase(keyword)
                .stream()
                .map(department -> searchMapper.build(
                        department.getId(),
                        department.getDepartmentName(),
                        department.getDepartmentCode(),
                        "Department"
                ))
                .toList();
    }

    @Override
    public List<SearchResponseDto> searchSubjects(String keyword) {

        return subjectRepository.findBySubjectNameContainingIgnoreCase(keyword)
                .stream()
                .map(subject -> searchMapper.build(
                        subject.getId(),
                        subject.getSubjectName(),
                        subject.getSubjectCode(),
                        "Subject"
                ))
                .toList();
    }

    @Override
    public List<SearchResponseDto> searchExams(String keyword) {

        return examRepository.findByExamNameContainingIgnoreCase(keyword)
                .stream()
                .map(exam -> searchMapper.build(
                        exam.getId(),
                        exam.getExamName(),
                        exam.getExamCode(),
                        "Exam"
                ))
                .toList();
    }

}