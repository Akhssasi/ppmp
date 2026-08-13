package com.ppmp.modules.notification.controller;

import com.ppmp.modules.notification.dto.NotificationDto;
import com.ppmp.modules.notification.service.NotificationService;
import com.ppmp.shared.constants.AppConstants;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.response.PagedResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<NotificationDto>>> getNotifications(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.ok("Notifications",
                notificationService.getMyNotifications(SecurityUtil.getCurrentUserId(), pageable)));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        return ResponseEntity.ok(ApiResponse.ok("Unread count",
                notificationService.getUnreadCount(SecurityUtil.getCurrentUserId())));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDto>> markAsRead(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read",
                notificationService.markAsRead(id, SecurityUtil.getCurrentUserId())));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Integer>> markAllRead() {
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read",
                notificationService.markAllRead(SecurityUtil.getCurrentUserId())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        notificationService.delete(id, SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Notification deleted", null));
    }
}
