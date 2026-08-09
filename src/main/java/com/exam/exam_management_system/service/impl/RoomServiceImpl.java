package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.RoomRequestDto;
import com.exam.exam_management_system.dto.RoomResponseDto;
import com.exam.exam_management_system.entity.Block;
import com.exam.exam_management_system.entity.Room;
import com.exam.exam_management_system.entity.Seat;
import com.exam.exam_management_system.enums.SeatStatus;
import com.exam.exam_management_system.exception.ResourceNotFoundException;
import com.exam.exam_management_system.mapper.RoomMapper;
import com.exam.exam_management_system.repository.BlockRepository;
import com.exam.exam_management_system.repository.RoomRepository;
import com.exam.exam_management_system.repository.SeatRepository;
import com.exam.exam_management_system.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final BlockRepository blockRepository;
    private final SeatRepository seatRepository;
    private final RoomMapper roomMapper;

    @Override
    public RoomResponseDto createRoom(RoomRequestDto roomRequestDto) {

        if (roomRepository.existsByRoomNumber(roomRequestDto.getRoomNumber())) {
            throw new IllegalArgumentException("Room number already exists.");
        }

        Block block = blockRepository.findById(roomRequestDto.getBlockId())
                .orElseThrow(() -> new ResourceNotFoundException("Block not found with id: " + roomRequestDto.getBlockId()));

        Room room = roomMapper.toEntity(roomRequestDto, block);

        Room savedRoom = roomRepository.save(room);

        generateSeatsForRoom(savedRoom);

        return roomMapper.toResponseDto(savedRoom);
    }

    @Override
    public List<RoomResponseDto> getAllRooms() {

        return roomRepository.findAll()
                .stream()
                .map(roomMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public RoomResponseDto getRoomById(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        return roomMapper.toResponseDto(room);
    }

    @Override
    public RoomResponseDto updateRoom(Long id, RoomRequestDto roomRequestDto) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        if (!room.getRoomNumber().equals(roomRequestDto.getRoomNumber())
                && roomRepository.existsByRoomNumber(roomRequestDto.getRoomNumber())) {
            throw new IllegalArgumentException("Room number already exists.");
        }

        Block block = blockRepository.findById(roomRequestDto.getBlockId())
                .orElseThrow(() -> new ResourceNotFoundException("Block not found with id: " + roomRequestDto.getBlockId()));

        roomMapper.updateEntity(room, roomRequestDto, block);

        Room updatedRoom = roomRepository.save(room);

        generateSeatsForRoom(updatedRoom);

        return roomMapper.toResponseDto(updatedRoom);
    }

    @Override
    public void deleteRoom(Long id) {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));

        roomRepository.delete(room);
    }

    private void generateSeatsForRoom(Room room) {
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