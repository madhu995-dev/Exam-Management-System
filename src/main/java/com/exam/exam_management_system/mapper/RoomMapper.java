package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.RoomRequestDto;
import com.exam.exam_management_system.dto.RoomResponseDto;
import com.exam.exam_management_system.entity.Block;
import com.exam.exam_management_system.entity.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public Room toEntity(RoomRequestDto dto, Block block) {

        return Room.builder()
                .roomNumber(dto.getRoomNumber())
                .capacity(dto.getCapacity())
                .total_Rows(dto.getRows())
                .total_columns(dto.getColumns())
                .status(dto.getStatus())
                .block(block)
                .build();
    }

    public RoomResponseDto toResponseDto(Room room) {

        return RoomResponseDto.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .capacity(room.getCapacity())
                .rows(room.getTotal_Rows())
                .columns(room.getTotal_columns())
                .status(room.getStatus())
                .blockId(room.getBlock().getId())
                .blockName(room.getBlock().getBlockName())
                .createdAt(room.getCreatedAt())
                .updatedAt(room.getUpdatedAt())
                .build();
    }

    public void updateEntity(Room room, RoomRequestDto dto, Block block) {

        room.setRoomNumber(dto.getRoomNumber());
        room.setCapacity(dto.getCapacity());
        room.setTotal_Rows(dto.getRows());
        room.setTotal_columns(dto.getColumns());
        room.setStatus(dto.getStatus());
        room.setBlock(block);
    }
}