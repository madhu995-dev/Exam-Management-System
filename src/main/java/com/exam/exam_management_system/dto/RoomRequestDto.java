package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.RoomStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRequestDto {

    @NotBlank(message = "Room number is required")
    @Size(max = 30, message = "Room number cannot exceed 30 characters")
    private String roomNumber;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    @NotNull(message = "Rows are required")
    @Min(value = 1, message = "Rows must be greater than 0")
    private Integer rows;

    @NotNull(message = "Columns are required")
    @Min(value = 1, message = "Columns must be greater than 0")
    private Integer columns;

    private RoomStatus status;

    @NotNull(message = "Block ID is required")
    private Long blockId;
}