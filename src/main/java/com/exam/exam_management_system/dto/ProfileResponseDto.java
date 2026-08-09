package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.entity.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDto {

    private Long id;

    private String username;

    private Role role;

    private Boolean enabled;

    private String createdAt;

}