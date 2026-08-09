package com.exam.exam_management_system.mapper;

import com.exam.exam_management_system.dto.NotificationResponseDto;
import com.exam.exam_management_system.entity.Notification;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationResponseDto toDto(Notification notification) {

        return NotificationResponseDto.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .userId(notification.getUser().getId())
                .username(notification.getUser().getUsername())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();

    }

}