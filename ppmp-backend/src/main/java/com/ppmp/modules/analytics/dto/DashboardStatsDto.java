package com.ppmp.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalProjects;
    private long completedProjects;
    private long inProgressProjects;
    private long planningProjects;
    private long onHoldProjects;
    private long archivedProjects;
    private long totalTasks;
    private long completedTasks;
    private long totalMilestones;
    private long completedMilestones;
    private long distinctTechnologies;
    private List<TechUsageDto> topTechnologies;
    private List<ActivityPointDto> recentActivity;
}
