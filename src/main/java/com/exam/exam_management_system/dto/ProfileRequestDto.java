package com.exam.exam_management_system.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequestDto {

    private String username;

    private String email;

    private String phoneNumber;

}