package com.exam.exam_management_system.dto;

import lombok.Data;

@Data

public class ChangePasswordRequestDto {

    private String oldPassword;

    private String newPassword;
    private String confirmPassword;

}