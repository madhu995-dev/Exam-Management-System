package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.HallTicketResponseDto;

import java.util.List;

public interface HallTicketService {

    HallTicketResponseDto generateHallTicket(Long examId, Long studentId);

    List<HallTicketResponseDto> generateHallTickets(Long examId);

    List<HallTicketResponseDto> getHallTicketsByExam(Long examId);

    List<HallTicketResponseDto> getHallTicketsByStudent(Long studentId);

    HallTicketResponseDto getHallTicket(String hallTicketNumber);

}