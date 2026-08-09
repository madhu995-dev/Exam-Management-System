package com.exam.exam_management_system.service.impl;

import com.exam.exam_management_system.dto.NotificationRequestDto;
import com.exam.exam_management_system.dto.NotificationResponseDto;
import com.exam.exam_management_system.entity.Notification;
import com.exam.exam_management_system.entity.User;
import com.exam.exam_management_system.mapper.NotificationMapper;
import com.exam.exam_management_system.repository.NotificationRepository;
import com.exam.exam_management_system.repository.UserRepository;
import com.exam.exam_management_system.service.NotificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    @Override
    public NotificationResponseDto createNotification(NotificationRequestDto requestDto) {

        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = Notification.builder()
                .title(requestDto.getTitle())
                .message(requestDto.getMessage())
                .type(requestDto.getType())
                .user(user)
                .isRead(false)
                .build();

        return notificationMapper.toDto(
                notificationRepository.save(notification)
        );

    }
    @Override
    public List<NotificationResponseDto> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toDto)
                .toList();

    }
    @Override
    public List<NotificationResponseDto> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalse(userId)
                .stream()
                .map(notificationMapper::toDto)
                .toList();

    }

    @Override
    public long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    public NotificationResponseDto markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        return notificationMapper.toDto(
                notificationRepository.save(notification)
        );
    }

    @Override
    public void markAllAsRead(Long userId) {

        List<Notification> notifications =
                notificationRepository.findByUserIdAndIsReadFalse(userId);

        notifications.forEach(notification ->
                notification.setIsRead(true));

        notificationRepository.saveAll(notifications);

    }
    @Override
    public void deleteNotification(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notificationRepository.delete(notification);

    }

}