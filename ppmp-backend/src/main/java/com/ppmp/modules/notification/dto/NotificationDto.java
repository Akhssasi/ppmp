package com.ppmp.modules.notification.dto;

import com.ppmp.shared.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private UUID id;
    private NotificationType type;
    private String message;
    private Boolean isRead;
    private UUID relatedEntityId;
    private LocalDateTime createdAt;
}
