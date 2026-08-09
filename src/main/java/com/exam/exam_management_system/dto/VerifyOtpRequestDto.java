package com.exam.exam_management_system.dto;

import lombok.Data;

@Data
public class VerifyOtpRequestDto {

    private String username;

    private String otp;
}