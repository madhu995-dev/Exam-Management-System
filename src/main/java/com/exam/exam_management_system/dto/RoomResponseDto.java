package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.RoomStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponseDto {

    private Long id;

    private String roomNumber;

    private Integer capacity;

    private Integer rows;

    private Integer columns;

    private RoomStatus status;

    private Long blockId;

    private String blockName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}