package com.ppmp.modules.portfolio.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioSettingsRequest {

    @Size(max = 255)
    private String headline;

    private String aboutText;

    @Size(max = 50)
    private String theme;

    private Boolean showGithubStats;

    private Boolean showContactForm;

    private Map<String, String> customLinks;
}
