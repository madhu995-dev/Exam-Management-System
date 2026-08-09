package com.exam.exam_management_system.service;

import com.exam.exam_management_system.dto.NotificationRequestDto;
import com.exam.exam_management_system.dto.NotificationResponseDto;

import java.util.List;

public interface NotificationService {

    NotificationResponseDto createNotification(NotificationRequestDto requestDto);

    List<NotificationResponseDto> getUserNotifications(Long userId);

    List<NotificationResponseDto> getUnreadNotifications(Long userId);

    long getUnreadNotificationCount(Long userId);

    NotificationResponseDto markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    void deleteNotification(Long notificationId);

}