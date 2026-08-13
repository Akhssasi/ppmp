package com.ppmp.modules.portfolio.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioSettingsDto {
    private UUID id;
    private UUID userId;
    private String headline;
    private String aboutText;
    private String theme;
    private Boolean showGithubStats;
    private Boolean showContactForm;
    private Map<String, String> customLinks;
    private LocalDateTime updatedAt;
}
