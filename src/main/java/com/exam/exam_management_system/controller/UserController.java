package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.*;
import com.exam.exam_management_system.entity.User;
import com.exam.exam_management_system.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return new ResponseEntity<>(
                userService.register(user),
                HttpStatus.CREATED
        );
    }    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequestDto request) {
        System.out.println("Controller reached");

        return ResponseEntity.ok(
                userService.changePassword(request));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequestDto request) {

        return ResponseEntity.ok(
                userService.forgotPassword(request)
        );
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequestDto request) {

        return ResponseEntity.ok(
                userService.verifyOtp(request)
        );
    }
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequestDto request) {

        return ResponseEntity.ok(
                userService.resetPassword(request)
        );
    }
}
