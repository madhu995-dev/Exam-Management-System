package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.*;
import com.exam.exam_management_system.entity.User;

public interface UserService {
    User register(User user);
    //User login(String username,String password);
    LoginResponse login(LoginRequest request);
    String changePassword(ChangePasswordRequestDto request);
    String forgotPassword(ForgotPasswordRequestDto request);

    String verifyOtp(VerifyOtpRequestDto request);

    String resetPassword(ResetPasswordRequestDto request);
}
