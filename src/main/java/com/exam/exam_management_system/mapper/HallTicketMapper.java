package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.HallTicketResponseDto;
import com.exam.exam_management_system.entity.HallTicket;
import org.springframework.stereotype.Component;

@Component
public class HallTicketMapper {

    public HallTicketResponseDto toResponseDto(HallTicket hallTicket) {

        HallTicketResponseDto dto = new HallTicketResponseDto();

        dto.setId(hallTicket.getId());
        dto.setHallTicketNumber(hallTicket.getHallTicketNumber());

        // Student Details
        dto.setStudentId(hallTicket.getStudent().getId());
        dto.setStudentName(hallTicket.getStudent().getFirstName()+" "+hallTicket.getStudent().getLastName());
        dto.setRollNumber(hallTicket.getStudent().getRollNumber());

        if (hallTicket.getStudent().getDepartment() != null) {
            dto.setDepartmentName(
                    hallTicket.getStudent()
                            .getDepartment()
                            .getDepartmentName()
            );
        }

        // Exam Details
        dto.setExamId(hallTicket.getExam().getId());
        dto.setExamName(hallTicket.getExam().getExamName());
        dto.setExamCode(hallTicket.getExam().getExamCode());

        // Subject Details
        dto.setSubjectId(hallTicket.getExam().getSubject().getId());
        dto.setSubjectName(hallTicket.getExam().getSubject().getSubjectName());
        dto.setSubjectCode(hallTicket.getExam().getSubject().getSubjectCode());

        // Exam Schedule
        dto.setExamDate(hallTicket.getExam().getExamDate());
        dto.setStartTime(hallTicket.getExam().getStartTime());
        dto.setEndTime(hallTicket.getExam().getEndTime());

        // Seat Details
        dto.setSeatId(hallTicket.getSeatAllocation().getSeat().getId());
        dto.setSeatNumber(hallTicket.getSeatAllocation().getSeat().getSeatNumber());
        dto.setRowNumber(hallTicket.getSeatAllocation().getSeat().getRowNumber());
        dto.setColumnNumber(hallTicket.getSeatAllocation().getSeat().getColumnNumber());

        // Room Details
        dto.setRoomId(hallTicket.getSeatAllocation().getSeat().getRoom().getId());
        dto.setRoomNumber(hallTicket.getSeatAllocation().getSeat().getRoom().getRoomNumber());

        // Block Details
        dto.setBlockId(hallTicket.getSeatAllocation().getSeat().getRoom().getBlock().getId());
        dto.setBlockName(hallTicket.getSeatAllocation().getSeat().getRoom().getBlock().getBlockName());

        dto.setGeneratedAt(hallTicket.getGeneratedAt());

        return dto;
    }
}