package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.InvigilatorAssignmentRequestDto;
import com.exam.exam_management_system.dto.InvigilatorAssignmentResponseDto;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.InvigilatorAssignment;
import com.exam.exam_management_system.entity.Room;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.InvigilatorAssignmentMapper;
import com.exam.exam_management_system.repository.ExamRepository;
import com.exam.exam_management_system.repository.FacultyRepository;
import com.exam.exam_management_system.repository.InvigilatorAssignmentRepository;
import com.exam.exam_management_system.repository.RoomRepository;
import com.exam.exam_management_system.service.InvigilatorAssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvigilatorAssignmentServiceImpl implements InvigilatorAssignmentService {

    private final InvigilatorAssignmentRepository assignmentRepository;
    private final ExamRepository examRepository;
    private final FacultyRepository facultyRepository;
    private final RoomRepository roomRepository;
    private final InvigilatorAssignmentMapper mapper;

    @Override
    public InvigilatorAssignmentResponseDto assignInvigilator(
            InvigilatorAssignmentRequestDto requestDto) {

        Exam exam = examRepository.findById(requestDto.getExamId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + requestDto.getExamId()));

        Faculty faculty = facultyRepository.findById(requestDto.getFacultyId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Faculty not found with id : " + requestDto.getFacultyId()));

        Room room = roomRepository.findById(requestDto.getRoomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room not found with id : " + requestDto.getRoomId()));

        if (assignmentRepository.existsByExamAndFaculty(exam, faculty)) {
            throw new IllegalStateException(
                    "Faculty is already assigned for this exam.");
        }

        if (assignmentRepository.existsByExamAndRoom(exam, room)) {
            throw new IllegalStateException(
                    "Room already has an invigilator assigned for this exam.");
        }

        InvigilatorAssignment assignment = new InvigilatorAssignment();

        assignment.setExam(exam);
        assignment.setFaculty(faculty);
        assignment.setRoom(room);

        InvigilatorAssignment saved = assignmentRepository.save(assignment);

        return mapper.toResponseDto(saved);
    }

    @Override
    public List<InvigilatorAssignmentResponseDto> getAssignmentsByExam(Long examId) {

        return assignmentRepository.findByExamId(examId)
                .stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvigilatorAssignmentResponseDto> getAssignmentsByFaculty(Long facultyId) {

        return assignmentRepository.findByFacultyId(facultyId)
                .stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<InvigilatorAssignmentResponseDto> getAssignmentsByRoom(Long roomId) {

        return assignmentRepository.findByRoomId(roomId)
                .stream()
                .map(mapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAssignment(Long assignmentId) {

        InvigilatorAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Assignment not found with id : " + assignmentId));

        assignmentRepository.delete(assignment);
    }
}