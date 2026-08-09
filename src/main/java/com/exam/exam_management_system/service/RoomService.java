package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.RoomRequestDto;
import com.exam.exam_management_system.dto.RoomResponseDto;

import java.util.List;

public interface RoomService {

    RoomResponseDto createRoom(RoomRequestDto roomRequestDto);

    List<RoomResponseDto> getAllRooms();

    RoomResponseDto getRoomById(Long id);

    RoomResponseDto updateRoom(Long id, RoomRequestDto roomRequestDto);

    void deleteRoom(Long id);
}