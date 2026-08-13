package com.ppmp.modules.notification.service;

import com.ppmp.modules.notification.dto.NotificationDto;
import com.ppmp.modules.notification.entity.Notification;
import com.ppmp.modules.notification.repository.NotificationRepository;
import com.ppmp.modules.user.entity.User;
import com.ppmp.shared.enums.NotificationType;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import com.ppmp.shared.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void notify(User user, NotificationType type, String message, UUID relatedEntityId) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .build();
        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public PagedResponse<NotificationDto> getMyNotifications(UUID userId, Pageable pageable) {
        Page<Notification> page = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return PagedResponse.from(page, this::toDto);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDto markAsRead(UUID notificationId, UUID userId) {
        Notification notification = getOwned(notificationId, userId);
        notification.setIsRead(true);
        return toDto(notificationRepository.save(notification));
    }

    @Transactional
    public int markAllRead(UUID userId) {
        return notificationRepository.markAllRead(userId);
    }

    @Transactional
    public void delete(UUID notificationId, UUID userId) {
        Notification notification = getOwned(notificationId, userId);
        notificationRepository.delete(notification);
    }

    private Notification getOwned(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        if (!notification.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You cannot modify this notification");
        }
        return notification;
    }

    public NotificationDto toDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .isRead(notification.getIsRead())
                .relatedEntityId(notification.getRelatedEntityId())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
