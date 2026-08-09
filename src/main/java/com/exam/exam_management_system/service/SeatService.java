package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.SeatRequestDto;
import com.exam.exam_management_system.dto.SeatResponseDto;

import java.util.List;

public interface SeatService {

    SeatResponseDto createSeat(SeatRequestDto requestDto);

    List<SeatResponseDto> getAllSeats();

    SeatResponseDto getSeatById(Long id);

    List<SeatResponseDto> getSeatsByRoom(Long roomId);

    SeatResponseDto updateSeat(Long id, SeatRequestDto requestDto);

    void deleteSeat(Long id);

}