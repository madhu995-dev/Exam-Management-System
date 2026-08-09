package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.SeatAllocationResponseDto;
import com.exam.exam_management_system.entity.SeatAllocation;
import org.springframework.stereotype.Component;

@Component
public class SeatAllocationMapper {

    public SeatAllocationResponseDto toResponseDto(SeatAllocation allocation) {

        SeatAllocationResponseDto dto = new SeatAllocationResponseDto();

        dto.setId(allocation.getId());

        // Exam Details
        dto.setExamId(allocation.getExam().getId());
        dto.setExamName(allocation.getExam().getExamName());
        dto.setExamCode(allocation.getExam().getExamCode());

        // Student Details
        dto.setStudentId(allocation.getStudent().getId());
        dto.setStudentName(allocation.getStudent().getFirstName());
        dto.setRollNumber(allocation.getStudent().getRollNumber());

        if (allocation.getStudent().getDepartment() != null) {
            dto.setDepartmentName(allocation.getStudent().getDepartment().getDepartmentName());
        }

        // Seat Details
        dto.setSeatId(allocation.getSeat().getId());
        dto.setSeatNumber(allocation.getSeat().getSeatNumber());
        dto.setRowNumber(allocation.getSeat().getRowNumber());
        dto.setColumnNumber(allocation.getSeat().getColumnNumber());

        // Room Details
        dto.setRoomId(allocation.getSeat().getRoom().getId());
        dto.setRoomNumber(allocation.getSeat().getRoom().getRoomNumber());

        // Block Details
        dto.setBlockId(allocation.getSeat().getRoom().getBlock().getId());
        dto.setBlockName(allocation.getSeat().getRoom().getBlock().getBlockName());

        dto.setAllocatedAt(allocation.getAllocatedAt());

        return dto;
    }
}