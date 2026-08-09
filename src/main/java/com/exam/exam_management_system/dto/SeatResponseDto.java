package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.SeatStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatResponseDto {

    private Long id;

    private String seatNumber;

    private Integer rowNumber;

    private Integer columnNumber;

    private SeatStatus status;

    private Long roomId;

    private String roomNumber;

    private Long blockId;

    private String blockName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}