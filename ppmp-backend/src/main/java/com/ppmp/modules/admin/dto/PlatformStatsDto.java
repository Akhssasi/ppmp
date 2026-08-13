package com.ppmp.modules.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformStatsDto {
    private long totalUsers;
    private long totalProjects;
    private long totalTasks;
    private long totalFiles;
    private long totalActiveUsers;
    private long newUsersToday;
    private long newProjectsToday;
    private Map<String, Long> projectsByStatus;
    private Map<String, Long> projectsByVisibility;
    private List<AdminTechUsageDto> topTechnologies;
}
