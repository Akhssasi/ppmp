package com.ppmp.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityPointDto {
    private String username;
    private String action;
    private String projectTitle;
    private LocalDateTime createdAt;
}
