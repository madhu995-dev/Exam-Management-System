package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.SeatRequestDto;
import com.exam.exam_management_system.dto.SeatResponseDto;
import com.exam.exam_management_system.entity.Room;
import com.exam.exam_management_system.entity.Seat;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.SeatMapper;
import com.exam.exam_management_system.repository.RoomRepository;
import com.exam.exam_management_system.repository.SeatRepository;
import com.exam.exam_management_system.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final RoomRepository roomRepository;
    private final SeatMapper seatMapper;

    @Override
    public SeatResponseDto createSeat(SeatRequestDto requestDto) {

        Room room = roomRepository.findById(requestDto.getRoomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + requestDto.getRoomId()));

        if (seatRepository.existsByRoomAndSeatNumber(room, requestDto.getSeatNumber())) {
            throw new IllegalArgumentException("Seat number already exists in this room.");
        }

        Seat seat = seatMapper.toEntity(requestDto, room);

        return seatMapper.toResponseDto(seatRepository.save(seat));
    }

    @Override
    public List<SeatResponseDto> getAllSeats() {

        return seatRepository.findAll()
                .stream()
                .map(seatMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public SeatResponseDto getSeatById(Long id) {

        Seat seat = seatRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seat not found with id: " + id));

        return seatMapper.toResponseDto(seat);
    }

    @Override
    public List<SeatResponseDto> getSeatsByRoom(Long roomId) {

        return seatRepository.findByRoomId(roomId)
                .stream()
                .map(seatMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public SeatResponseDto updateSeat(Long id, SeatRequestDto requestDto) {

        Seat seat = seatRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seat not found with id: " + id));

        Room room = roomRepository.findById(requestDto.getRoomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Room not found with id: " + requestDto.getRoomId()));

        if (!seat.getSeatNumber().equals(requestDto.getSeatNumber())
                && seatRepository.existsByRoomAndSeatNumber(room, requestDto.getSeatNumber())) {
            throw new IllegalArgumentException("Seat number already exists in this room.");
        }

        seatMapper.updateEntity(seat, requestDto, room);

        return seatMapper.toResponseDto(seatRepository.save(seat));
    }

    @Override
    public void deleteSeat(Long id) {

        Seat seat = seatRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Seat not found with id: " + id));

        seatRepository.delete(seat);
    }
}