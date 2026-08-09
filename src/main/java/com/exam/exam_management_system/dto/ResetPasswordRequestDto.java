package com.exam.exam_management_system.dto;

import lombok.Data;

@Data
public class ResetPasswordRequestDto {

    private String username;

    private String otp;

    private String newPassword;

    private String confirmPassword;
}