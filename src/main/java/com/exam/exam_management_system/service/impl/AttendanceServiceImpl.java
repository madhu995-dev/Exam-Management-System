package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.AttendanceRequestDto;
import com.exam.exam_management_system.dto.AttendanceResponseDto;
import com.exam.exam_management_system.entity.Attendance;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.AttendanceMapper;
import com.exam.exam_management_system.repository.AttendanceRepository;
import com.exam.exam_management_system.repository.ExamRepository;
import com.exam.exam_management_system.repository.FacultyRepository;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final ExamRepository examRepository;
    private final AttendanceMapper attendanceMapper;

    private Faculty resolveFaculty(Long facultyId) {
        if (facultyId != null) {
            return facultyRepository.findById(facultyId)
                    .orElseGet(() -> facultyRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new ResourceNotFoundException("No faculty member exists in the system to mark attendance.")));
        }
        return facultyRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No faculty member exists in the system to mark attendance."));
    }

    @Override
    public AttendanceResponseDto markAttendance(AttendanceRequestDto requestDto) {

        Exam exam = examRepository.findById(requestDto.getExamId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + requestDto.getExamId()));

        Student student = studentRepository.findById(requestDto.getStudentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + requestDto.getStudentId()));

        Faculty faculty = resolveFaculty(requestDto.getFacultyId());

        if (attendanceRepository.existsByExamAndStudent(exam, student)) {
            throw new IllegalStateException(
                    "Attendance already marked for this student.");
        }

        Attendance attendance = new Attendance();

        attendance.setExam(exam);
        attendance.setStudent(student);
        attendance.setFaculty(faculty);
        attendance.setAttendanceStatus(requestDto.getAttendanceStatus());
        attendance.setRemarks(requestDto.getRemarks());

        Attendance saved = attendanceRepository.save(attendance);

        return attendanceMapper.toResponseDto(saved);
    }

    @Override
    public AttendanceResponseDto updateAttendance(
            Long attendanceId,
            AttendanceRequestDto requestDto) {

        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance not found with id : " + attendanceId));

        Faculty faculty = resolveFaculty(requestDto.getFacultyId());

        attendance.setFaculty(faculty);
        attendance.setAttendanceStatus(requestDto.getAttendanceStatus());
        attendance.setRemarks(requestDto.getRemarks());

        Attendance updated = attendanceRepository.save(attendance);

        return attendanceMapper.toResponseDto(updated);
    }

    @Override
    public List<AttendanceResponseDto> getAttendanceByExam(Long examId) {

        return attendanceRepository.findByExamId(examId)
                .stream()
                .map(attendanceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponseDto> getAttendanceByStudent(Long studentId) {

        return attendanceRepository.findByStudentId(studentId)
                .stream()
                .map(attendanceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponseDto> getAttendanceByFaculty(Long facultyId) {

        return attendanceRepository.findByFacultyId(facultyId)
                .stream()
                .map(attendanceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponseDto> getPresentStudents(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + examId));

        return attendanceRepository
                .findByExamAndAttendanceStatus(
                        exam,
                        com.exam.exam_management_system.enums.AttendanceStatus.PRESENT)
                .stream()
                .map(attendanceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AttendanceResponseDto> getAbsentStudents(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + examId));

        return attendanceRepository
                .findByExamAndAttendanceStatus(
                        exam,
                        com.exam.exam_management_system.enums.AttendanceStatus.ABSENT)
                .stream()
                .map(attendanceMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAttendance(Long attendanceId) {

        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Attendance not found with id : " + attendanceId));

        attendanceRepository.delete(attendance);
    }
}