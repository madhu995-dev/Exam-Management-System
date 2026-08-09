package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.InvigilatorAssignmentRequestDto;
import com.exam.exam_management_system.dto.InvigilatorAssignmentResponseDto;

import java.util.List;

public interface InvigilatorAssignmentService {

    InvigilatorAssignmentResponseDto assignInvigilator(
            InvigilatorAssignmentRequestDto requestDto
    );

    List<InvigilatorAssignmentResponseDto> getAssignmentsByExam(Long examId);

    List<InvigilatorAssignmentResponseDto> getAssignmentsByFaculty(Long facultyId);

    List<InvigilatorAssignmentResponseDto> getAssignmentsByRoom(Long roomId);

    void deleteAssignment(Long assignmentId);

}