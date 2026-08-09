package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.SeatRequestDto;
import com.exam.exam_management_system.dto.SeatResponseDto;
import com.exam.exam_management_system.entity.Room;
import com.exam.exam_management_system.entity.Seat;
import org.springframework.stereotype.Component;

@Component
public class SeatMapper {

    public Seat toEntity(SeatRequestDto dto, Room room) {

        return Seat.builder()
                .seatNumber(dto.getSeatNumber())
                .rowNumber(dto.getRowNumber())
                .columnNumber(dto.getColumnNumber())
                .status(dto.getStatus())
                .room(room)
                .build();
    }

    public SeatResponseDto toResponseDto(Seat seat) {

        return SeatResponseDto.builder()
                .id(seat.getId())
                .seatNumber(seat.getSeatNumber())
                .rowNumber(seat.getRowNumber())
                .columnNumber(seat.getColumnNumber())
                .status(seat.getStatus())
                .roomId(seat.getRoom().getId())
                .roomNumber(seat.getRoom().getRoomNumber())
                .blockId(seat.getRoom().getBlock().getId())
                .blockName(seat.getRoom().getBlock().getBlockName())
                .createdAt(seat.getCreatedAt())
                .updatedAt(seat.getUpdatedAt())
                .build();
    }

    public void updateEntity(Seat seat,
                             SeatRequestDto dto,
                             Room room) {

        seat.setSeatNumber(dto.getSeatNumber());
        seat.setRowNumber(dto.getRowNumber());
        seat.setColumnNumber(dto.getColumnNumber());
        seat.setStatus(dto.getStatus());
        seat.setRoom(room);
    }
}