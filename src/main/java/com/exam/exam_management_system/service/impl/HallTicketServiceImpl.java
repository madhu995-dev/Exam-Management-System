package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.HallTicketResponseDto;
import com.exam.exam_management_system.entity.Exam;
import com.exam.exam_management_system.entity.HallTicket;
import com.exam.exam_management_system.entity.SeatAllocation;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.HallTicketMapper;
import com.exam.exam_management_system.repository.ExamRepository;
import com.exam.exam_management_system.repository.HallTicketRepository;
import com.exam.exam_management_system.repository.SeatAllocationRepository;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.service.HallTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HallTicketServiceImpl implements HallTicketService {

    private final HallTicketRepository hallTicketRepository;
    private final StudentRepository studentRepository;
    private final ExamRepository examRepository;
    private final SeatAllocationRepository seatAllocationRepository;
    private final HallTicketMapper hallTicketMapper;

    @Override
    public HallTicketResponseDto generateHallTicket(Long examId, Long studentId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + examId));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Student not found with id : " + studentId));

        if (hallTicketRepository.existsByStudentAndExam(student, exam)) {
            throw new IllegalStateException(
                    "Hall Ticket already generated for this student.");
        }

        SeatAllocation allocation = seatAllocationRepository
                .findByExamAndStudent(exam, student)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Seat allocation not found. Allocate seats first."));

        HallTicket hallTicket = new HallTicket();

        hallTicket.setExam(exam);
        hallTicket.setStudent(student);
        hallTicket.setSeatAllocation(allocation);
        hallTicket.setHallTicketNumber(generateHallTicketNumber());

        HallTicket saved = hallTicketRepository.save(hallTicket);

        return hallTicketMapper.toResponseDto(saved);
    }

    @Override
    public List<HallTicketResponseDto> generateHallTickets(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Exam not found with id : " + examId));

        List<SeatAllocation> allocations =
                seatAllocationRepository.findByExamId(examId);

        if (allocations.isEmpty()) {
            throw new IllegalStateException(
                    "No seat allocations found for this exam.");
        }

        List<HallTicketResponseDto> response = new ArrayList<>();

        for (SeatAllocation allocation : allocations) {

            Student student = allocation.getStudent();

            if (hallTicketRepository.existsByStudentAndExam(student, exam)) {
                continue;
            }

            HallTicket hallTicket = new HallTicket();

            hallTicket.setExam(exam);
            hallTicket.setStudent(student);
            hallTicket.setSeatAllocation(allocation);
            hallTicket.setHallTicketNumber(generateHallTicketNumber());

            HallTicket saved = hallTicketRepository.save(hallTicket);

            response.add(hallTicketMapper.toResponseDto(saved));
        }

        return response;
    }

    @Override
    public List<HallTicketResponseDto> getHallTicketsByExam(Long examId) {

        return hallTicketRepository.findByExamId(examId)
                .stream()
                .map(hallTicketMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<HallTicketResponseDto> getHallTicketsByStudent(Long studentId) {

        return hallTicketRepository.findByStudentId(studentId)
                .stream()
                .map(hallTicketMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public HallTicketResponseDto getHallTicket(String hallTicketNumber) {

        HallTicket hallTicket = hallTicketRepository
                .findByHallTicketNumber(hallTicketNumber)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Hall Ticket not found with number : "
                                        + hallTicketNumber));

        return hallTicketMapper.toResponseDto(hallTicket);
    }

    private String generateHallTicketNumber() {

        return "HT-" + UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 8)
                .toUpperCase();
    }
}