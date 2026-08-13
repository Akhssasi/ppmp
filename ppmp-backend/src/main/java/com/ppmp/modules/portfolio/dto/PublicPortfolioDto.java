package com.ppmp.modules.portfolio.dto;

import com.ppmp.modules.project.dto.ProjectListDto;
import com.ppmp.modules.user.dto.PublicUserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicPortfolioDto {
    private PublicUserDto user;
    private PortfolioSettingsDto settings;
    private List<ProjectListDto> projects;
    private long totalProjects;
    private long completedProjects;
    private long inProgressProjects;
    private List<String> topTechnologies;
}
