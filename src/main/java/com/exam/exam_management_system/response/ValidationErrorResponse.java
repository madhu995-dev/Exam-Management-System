package com.exam.exam_management_system.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class ValidationErrorResponse {
    private String timestamp;
    private int status;
    private String error;
    private String message;
    private Map<String,String> errors;
}
