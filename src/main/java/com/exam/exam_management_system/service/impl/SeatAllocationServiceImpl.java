package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.SeatAllocationResponseDto;
import com.exam.exam_management_system.entity.*;
import com.exam.exam_management_system.enums.SeatStatus;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.SeatAllocationMapper;
import com.exam.exam_management_system.repository.*;
import com.exam.exam_management_system.service.SeatAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SeatAllocationServiceImpl implements SeatAllocationService {

    private final SeatAllocationRepository seatAllocationRepository;
    private final ExamRepository examRepository;
    private final StudentSubjectRepository studentSubjectRepository;
    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final SeatAllocationMapper seatAllocationMapper;
    private final HallTicketRepository hallTicketRepository;

    @Override
    public List<SeatAllocationResponseDto> allocateSeats(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exam not found with id : " + examId));

        // Prevent duplicate allocation
        List<SeatAllocation> existing = seatAllocationRepository.findByExamId(examId);
        if (!existing.isEmpty()) {
            throw new IllegalStateException("Seats already allocated for this exam.");
        }

        // Get all students registered for this subject
        List<Student> students = studentSubjectRepository
                .findBySubjectId(exam.getSubject().getId())
                .stream()
                .map(StudentSubject::getStudent)
                .sorted(Comparator.comparing(Student::getRollNumber))
                .collect(Collectors.toList());

        if (students.isEmpty()) {
            throw new IllegalStateException("No students registered for this subject.");
        }

        // Ensure all rooms have their seat entities generated
        ensureSeatsGeneratedForRooms();

        // Get all available seats
        List<Seat> seats = seatRepository.findAll()
                .stream()
                .filter(seat -> seat.getStatus() == SeatStatus.AVAILABLE)
                .sorted(Comparator
                        .comparing((Seat s) -> s.getRoom().getId())
                        .thenComparing(Seat::getRowNumber)
                        .thenComparing(Seat::getColumnNumber))
                .collect(Collectors.toList());

        if (seats.size() < students.size()) {
            throw new IllegalStateException(
                    "Insufficient seats. Available : "
                            + seats.size()
                            + ", Required : "
                            + students.size());
        }

        List<SeatAllocationResponseDto> response = new ArrayList<>();

        for (int i = 0; i < students.size(); i++) {

            Student student = students.get(i);
            Seat seat = seats.get(i);

            SeatAllocation allocation = new SeatAllocation();
            allocation.setExam(exam);
            allocation.setStudent(student);
            allocation.setSeat(seat);

            SeatAllocation saved = seatAllocationRepository.save(allocation);

            response.add(seatAllocationMapper.toResponseDto(saved));
        }

        return response;
    }

    private void ensureSeatsGeneratedForRooms() {
        List<Room> allRooms = roomRepository.findAll();
        for (Room room : allRooms) {
            int rows = room.getTotal_Rows() != null && room.getTotal_Rows() > 0 ? room.getTotal_Rows() : 5;
            int cols = room.getTotal_columns() != null && room.getTotal_columns() > 0 ? room.getTotal_columns() : 6;
            int capacity = room.getCapacity() != null && room.getCapacity() > 0 ? room.getCapacity() : (rows * cols);

            int count = 0;
            List<Seat> newSeats = new ArrayList<>();
            for (int r = 1; r <= rows; r++) {
                for (int c = 1; c <= cols; c++) {
                    if (count >= capacity) break;
                    String seatNum = room.getRoomNumber() + "-S" + (count + 1);
                    if (!seatRepository.existsByRoomAndSeatNumber(room, seatNum)) {
                        Seat seat = Seat.builder()
                                .room(room)
                                .seatNumber(seatNum)
                                .rowNumber(r)
                                .columnNumber(c)
                                .status(SeatStatus.AVAILABLE)
                                .build();
                        newSeats.add(seat);
                    }
                    count++;
                }
                if (count >= capacity) break;
            }
            if (!newSeats.isEmpty()) {
                seatRepository.saveAll(newSeats);
            }
        }
    }

    @Override
    public List<SeatAllocationResponseDto> getAllocationByExam(Long examId) {

        return seatAllocationRepository.findByExamId(examId)
                .stream()
                .map(seatAllocationMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SeatAllocationResponseDto> getAllocationByStudent(Long studentId) {

        return seatAllocationRepository.findByStudentId(studentId)
                .stream()
                .map(seatAllocationMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAllocation(Long examId) {

        Exam exam = examRepository.findById(examId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Exam not found with id : " + examId));

        // Delete associated hall tickets first to prevent SQL Foreign Key Constraint failure
        hallTicketRepository.deleteByExam(exam);

        // Delete seat allocations
        seatAllocationRepository.deleteByExam(exam);
    }
}