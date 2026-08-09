package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDto {

    private Long id;

    private String title;

    private String message;

    private NotificationType type;

    private Long userId;

    private String username;

    private Boolean isRead;

    private LocalDateTime createdAt;

}