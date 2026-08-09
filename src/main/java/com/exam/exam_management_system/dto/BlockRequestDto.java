package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.BlockStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockRequestDto {

    @NotBlank(message = "Block name is required")
    @Size(max = 100, message = "Block name cannot exceed 100 characters")
    private String blockName;

    @NotBlank(message = "Block code is required")
    @Size(max = 20, message = "Block code cannot exceed 20 characters")
    private String blockCode;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    private BlockStatus status;
}