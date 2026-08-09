package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.ExamRequestDto;
import com.exam.exam_management_system.dto.ExamResponseDto;
import com.exam.exam_management_system.entity.Department;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.ExaminationSeries;
import com.exam.exam_management_system.entity.Subject;
import com.exam.exam_management_system.enums.SeriesStatus;
import com.exam.exam_management_system.enums.SubjectType;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.ExamMapper;
import com.exam.exam_management_system.repository.DepartmentRepository;
import com.exam.exam_management_system.repository.ExamRepository;
import com.exam.exam_management_system.repository.ExaminationSeriesRepository;
import com.exam.exam_management_system.repository.SubjectRepository;
import com.exam.exam_management_system.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final ExaminationSeriesRepository examinationSeriesRepository;
    private final SubjectRepository subjectRepository;
    private final DepartmentRepository departmentRepository;
    private final ExamMapper examMapper;

    @Override
    public ExamResponseDto createExam(ExamRequestDto requestDto) {

        if (examRepository.existsByExamCode(requestDto.getExamCode())) {
            throw new IllegalArgumentException("Exam code already exists: " + requestDto.getExamCode());
        }

        // Auto-resolve or create ExaminationSeries
        ExaminationSeries series = null;
        if (requestDto.getSeriesId() != null) {
            series = examinationSeriesRepository.findById(requestDto.getSeriesId()).orElse(null);
        }
        if (series == null) {
            series = examinationSeriesRepository.findAll().stream().findFirst().orElseGet(() -> {
                ExaminationSeries newSeries = ExaminationSeries.builder()
                        .seriesName("Main Examination Series 2026")
                        .description("Default Examination Series")
                        .status(SeriesStatus.UPCOMING)
                        .startDate(LocalDateTime.now())
                        .endDate(LocalDateTime.now().plusMonths(3))
                        .build();
                return examinationSeriesRepository.save(newSeries);
            });
        }

        // Auto-resolve or create Subject
        Subject subject = null;
        if (requestDto.getSubjectId() != null) {
            subject = subjectRepository.findById(requestDto.getSubjectId()).orElse(null);
        }
        if (subject == null) {
            subject = subjectRepository.findAll().stream().findFirst().orElseGet(() -> {
                Department dept = departmentRepository.findAll().stream().findFirst().orElseGet(() -> {
                    Department newDept = new Department();
                    newDept.setDepartmentName("Computer Science Engineering");
                    newDept.setDepartmentCode("CSE");
                    return departmentRepository.save(newDept);
                });

                Subject newSubject = Subject.builder()
                        .subjectName("Core Computer Science")
                        .subjectCode("CS101_" + (System.currentTimeMillis() % 10000))
                        .credits(4)
                        .subjectType(SubjectType.THEORY)
                        .department(dept)
                        .build();
                return subjectRepository.save(newSubject);
            });
        }

        Exam exam = examMapper.toEntity(requestDto, series, subject);

        return examMapper.toResponseDto(examRepository.save(exam));
    }

    @Override
    public List<ExamResponseDto> getAllExams() {

        return examRepository.findAll()
                .stream()
                .map(examMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public ExamResponseDto getExamById(Long id) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exam not found with id: " + id));

        return examMapper.toResponseDto(exam);
    }

    @Override
    public ExamResponseDto updateExam(Long id, ExamRequestDto requestDto) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exam not found with id: " + id));

        if (!exam.getExamCode().equals(requestDto.getExamCode())
                && examRepository.existsByExamCode(requestDto.getExamCode())) {
            throw new IllegalArgumentException("Exam code already exists.");
        }

        ExaminationSeries series = examinationSeriesRepository.findById(requestDto.getSeriesId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Examination Series not found with id: " + requestDto.getSeriesId()));

        Subject subject = subjectRepository.findById(requestDto.getSubjectId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Subject not found with id: " + requestDto.getSubjectId()));

        examMapper.updateEntity(exam, requestDto, series, subject);

        return examMapper.toResponseDto(examRepository.save(exam));
    }

    @Override
    public void deleteExam(Long id) {

        Exam exam = examRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exam not found with id: " + id));

        examRepository.delete(exam);
    }
}