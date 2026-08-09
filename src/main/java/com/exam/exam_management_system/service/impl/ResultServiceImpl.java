package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.ResultRequestDto;
import com.exam.exam_management_system.dto.ResultResponseDto;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Result;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.ResultMapper;
import com.exam.exam_management_system.repository.ExamRepository;
import com.exam.exam_management_system.repository.ResultRepository;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;
    private final ResultMapper resultMapper;

    @Override
    public ResultResponseDto publishResult(ResultRequestDto requestDto) {

        Exam exam = examRepository.findById(requestDto.getExamId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + requestDto.getExamId()));

        Student student = studentRepository.findById(requestDto.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + requestDto.getStudentId()));

        if (resultRepository.existsByExamAndStudent(exam, student)) {
            throw new IllegalStateException(
                    "Result already published for this student.");
        }

        validateMarks(requestDto);

        Result result = new Result();

        result.setExam(exam);
        result.setStudent(student);

        int internal = requestDto.getInternalMarks() == null ? 0 : requestDto.getInternalMarks();
        int external = requestDto.getExternalMarks() == null ? 0 : requestDto.getExternalMarks();
        int practical = requestDto.getPracticalMarks() == null ? 0 : requestDto.getPracticalMarks();

        result.setInternalMarks(internal);
        result.setExternalMarks(external);
        result.setPracticalMarks(practical);

        int total = internal + external + practical;
        result.setTotalMarks(total);

        double percentage = Math.min(100.0, total);
        result.setPercentage(percentage);

        result.setGrade(calculateGrade(percentage));
        result.setPass(percentage >= 40);

        result.setRemarks(requestDto.getRemarks());

        return resultMapper.toResponseDto(
                resultRepository.save(result)
        );
    }

    @Override
    public ResultResponseDto updateResult(
            Long resultId,
            ResultRequestDto requestDto) {

        Result result = resultRepository.findById(resultId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Result not found with id : " + resultId));

        validateMarks(requestDto);

        int internal = requestDto.getInternalMarks() == null ? 0 : requestDto.getInternalMarks();
        int external = requestDto.getExternalMarks() == null ? 0 : requestDto.getExternalMarks();
        int practical = requestDto.getPracticalMarks() == null ? 0 : requestDto.getPracticalMarks();

        result.setInternalMarks(internal);
        result.setExternalMarks(external);
        result.setPracticalMarks(practical);

        int total = internal + external + practical;
        result.setTotalMarks(total);

        double percentage = Math.min(100.0, total);
        result.setPercentage(percentage);

        result.setGrade(calculateGrade(percentage));
        result.setPass(percentage >= 40);

        result.setRemarks(requestDto.getRemarks());

        return resultMapper.toResponseDto(resultRepository.save(result));
    }

    @Override
    public ResultResponseDto getResult(
            Long examId,
            Long studentId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + examId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + studentId));

        Result result = resultRepository.findByExamAndStudent(exam, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Result not found."));

        return resultMapper.toResponseDto(result);
    }

    @Override
    public List<ResultResponseDto> getResultsByExam(Long examId) {

        return resultRepository.findByExamId(examId)
                .stream()
                .map(resultMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResultResponseDto> getResultsByStudent(Long studentId) {

        return resultRepository.findByStudentId(studentId)
                .stream()
                .map(resultMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteResult(Long resultId) {

        Result result = resultRepository.findById(resultId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Result not found with id : " + resultId));

        resultRepository.delete(result);
    }

    private void validateMarks(ResultRequestDto requestDto) {
        int internal = requestDto.getInternalMarks() == null ? 0 : requestDto.getInternalMarks();
        int external = requestDto.getExternalMarks() == null ? 0 : requestDto.getExternalMarks();
        int practical = requestDto.getPracticalMarks() == null ? 0 : requestDto.getPracticalMarks();

        if (internal < 0 || internal > 30) {
            throw new IllegalArgumentException(
                    "Internal marks should be between 0 and 30.");
        }

        if (external < 0 || external > 70) {
            throw new IllegalArgumentException(
                    "External marks should be between 0 and 70.");
        }

        if (practical < 0 || practical > 100) {
            throw new IllegalArgumentException(
                    "Practical marks should be between 0 and 100.");
        }
    }

    private String calculateGrade(double percentage) {

        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";

        return "F";
    }
}