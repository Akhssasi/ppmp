package com.ppmp.modules.activity.dto;

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
public class ActivityDto {
    private UUID id;
    private UUID projectId;
    private UUID userId;
    private String username;
    private String action;
    private String details;
    private LocalDateTime createdAt;
}
