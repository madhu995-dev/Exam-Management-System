package com.exam.exam_management_system.dto;

import com.exam.exam_management_system.enums.NotificationType;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDto {

    private String title;

    private String message;

    private NotificationType type;

    private Long userId;

}