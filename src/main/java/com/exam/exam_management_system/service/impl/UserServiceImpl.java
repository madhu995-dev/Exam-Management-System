package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.*;
import com.exam.exam_management_system.entity.Faculty;
import com.exam.exam_management_system.entity.Role;
import com.exam.exam_management_system.entity.Student;
import com.exam.exam_management_system.entity.User;
import com.exam.exam_management_system.repository.FacultyRepository;
import com.exam.exam_management_system.repository.StudentRepository;
import com.exam.exam_management_system.repository.UserRepository;
import com.exam.exam_management_system.service.CustomerUserDetailsService;
import com.exam.exam_management_system.service.EmailService;
import com.exam.exam_management_system.service.JwtService;
import com.exam.exam_management_system.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomerUserDetailsService customerUserDetailsService;
    private final EmailService emailService;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService, CustomerUserDetailsService customerUserDetailsService, EmailService emailService, StudentRepository studentRepository, FacultyRepository facultyRepository){
        this.userRepository=userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.customerUserDetailsService = customerUserDetailsService;
        this.emailService = emailService;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
    }

    private void ensureUserExists(String username) {
        if (!userRepository.existsByUsername(username)) {
            // Check if username matches a Faculty employeeId
            Optional<Faculty> facultyOpt = facultyRepository.findByEmployeeId(username);
            if (facultyOpt.isPresent()) {
                Faculty f = facultyOpt.get();
                User user = User.builder()
                        .username(f.getEmployeeId())
                        .email(f.getEmail() != null && !f.getEmail().trim().isEmpty() ? f.getEmail() : f.getEmployeeId().toLowerCase() + "@college.edu")
                        .password(passwordEncoder.encode("Faculty@123"))
                        .role(Role.FACULTY)
                        .enabled(true)
                        .build();
                userRepository.save(user);
                return;
            }

            // Check if username matches a Student rollNumber or hallTicketNumber
            Optional<Student> studentOpt = studentRepository.findByRollNumber(username);
            if (studentOpt.isEmpty()) {
                studentOpt = studentRepository.findByHallTicketNumber(username);
            }
            if (studentOpt.isPresent()) {
                Student s = studentOpt.get();
                User user = User.builder()
                        .username(s.getRollNumber() != null ? s.getRollNumber() : s.getHallTicketNumber())
                        .email(s.getEmail() != null && !s.getEmail().trim().isEmpty() ? s.getEmail() : username.toLowerCase() + "@college.edu")
                        .password(passwordEncoder.encode("Student@123"))
                        .role(Role.STUDENT)
                        .enabled(true)
                        .build();
                userRepository.save(user);
                return;
            }
        }
    }

    private String getUserEmail(User user) {
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) {
            return user.getEmail();
        }

        if (user.getRole() == null) {
            return user.getUsername() + "@college.edu";
        }

        switch (user.getRole()) {
            case STUDENT:
                return studentRepository.findByRollNumber(user.getUsername())
                        .map(s -> s.getEmail())
                        .orElse(user.getUsername() + "@college.edu");

            case FACULTY:
                return facultyRepository.findByEmployeeId(user.getUsername())
                        .map(f -> f.getEmail())
                        .orElse(user.getUsername() + "@college.edu");

            case ADMIN:
                return user.getEmail() != null ? user.getEmail() : "admin@college.edu";

            default:
                return user.getUsername() + "@college.edu";
        }
    }

    private String generateOtp() {
        int otp = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(otp);
    }

    @Override
    public String forgotPassword(ForgotPasswordRequestDto request) {
        ensureUserExists(request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = generateOtp();

        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        String email = getUserEmail(user);

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            System.err.println("Failed to send OTP email: " + e.getMessage());
        }

        return "OTP sent successfully to your registered email.";
    }

    @Override
    public String verifyOtp(VerifyOtpRequestDto request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null) {
            throw new RuntimeException("OTP not generated.");
        }

        if (!user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiryTime() != null && user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired.");
        }

        return "OTP verified successfully.";
    }

    @Override
    public String resetPassword(ResetPasswordRequestDto request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null) {
            throw new RuntimeException("OTP not generated.");
        }

        if (!user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        if (user.getOtpExpiryTime() != null && user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired.");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiryTime(null);

        userRepository.save(user);

        return "Password reset successfully.";
    }

    @Override
    public User register(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            user.setEmail(user.getUsername().toLowerCase() + "@college.edu");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // Auto-heal missing user account from faculty or student tables if needed
        ensureUserExists(request.getUsername());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = customerUserDetailsService
                .loadUserByUsername(request.getUsername());

        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(
                user.getUsername(),
                user.getRole(),
                token,
                "Login Successful"
        );
    }

    @Override
    public String changePassword(ChangePasswordRequestDto request) {

        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            throw new RuntimeException("Old password is incorrect");
        }
        if (request.getOldPassword().equals(request.getNewPassword())) {
            throw new RuntimeException("New password cannot be the same as the old password");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully.";
    }
}
