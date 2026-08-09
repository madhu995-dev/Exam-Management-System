package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String username;
    private Role role;
    private String token;
    private String message;
}
