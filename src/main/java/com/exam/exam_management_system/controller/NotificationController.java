package com.exam.exam_management_system.controller;

import com.exam.exam_management_system.dto.NotificationRequestDto;
import com.exam.exam_management_system.dto.NotificationResponseDto;
import com.exam.exam_management_system.service.NotificationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@SecurityRequirement(name = "Bearer Authentication")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ===========================
    // CREATE NOTIFICATION
    // ADMIN ONLY
    // ===========================
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationResponseDto> createNotification(
            @RequestBody NotificationRequestDto requestDto) {

        return new ResponseEntity<>(
                notificationService.createNotification(requestDto),
                HttpStatus.CREATED
        );
    }

    // ===========================
    // GET USER NOTIFICATIONS
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<NotificationResponseDto>> getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUserNotifications(userId)
        );
    }

    // ===========================
    // GET UNREAD NOTIFICATIONS
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/user/{userId}/unread")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
        );
    }

    // ===========================
    // GET UNREAD COUNT
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @GetMapping("/user/{userId}/count")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<Long> getUnreadCount(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotificationCount(userId)
        );
    }

    // ===========================
    // MARK NOTIFICATION AS READ
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<NotificationResponseDto> markAsRead(
            @PathVariable Long notificationId) {

        return ResponseEntity.ok(
                notificationService.markAsRead(notificationId)
        );
    }

    // ===========================
    // MARK ALL NOTIFICATIONS AS READ
    // ADMIN, FACULTY, STUDENT
    // ===========================
    @PutMapping("/user/{userId}/read-all")
    @PreAuthorize("hasAnyRole('ADMIN','FACULTY','STUDENT')")
    public ResponseEntity<String> markAllAsRead(
            @PathVariable Long userId) {

        notificationService.markAllAsRead(userId);

        return ResponseEntity.ok("All notifications marked as read.");
    }

    // ===========================
    // DELETE NOTIFICATION
    // ADMIN ONLY
    // ===========================
    @DeleteMapping("/{notificationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long notificationId) {

        notificationService.deleteNotification(notificationId);

        return ResponseEntity.ok("Notification deleted successfully.");
    }
}