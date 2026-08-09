package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.SeatStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatRequestDto {

    @NotBlank(message = "Seat number is required")
    private String seatNumber;

    @NotNull(message = "Row number is required")
    private Integer rowNumber;

    @NotNull(message = "Column number is required")
    private Integer columnNumber;

    @NotNull(message = "Room Id is required")
    private Long roomId;

    private SeatStatus status;

}