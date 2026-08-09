package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.BlockStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockResponseDto {

    private Long id;

    private String blockName;

    private String blockCode;

    private String description;

    private BlockStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}