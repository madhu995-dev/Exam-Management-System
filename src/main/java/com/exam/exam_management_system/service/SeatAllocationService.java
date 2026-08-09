package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.SeatAllocationResponseDto;

import java.util.List;

public interface SeatAllocationService {

    List<SeatAllocationResponseDto> allocateSeats(Long examId);

    List<SeatAllocationResponseDto> getAllocationByExam(Long examId);

    List<SeatAllocationResponseDto> getAllocationByStudent(Long studentId);

    void deleteAllocation(Long examId);

}