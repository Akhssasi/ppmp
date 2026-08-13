package com.ppmp.modules.analytics.service;

import com.ppmp.modules.analytics.dto.*;
import com.ppmp.modules.project.repository.ProjectRepository;
import com.ppmp.modules.task.repository.TaskRepository;
import com.ppmp.modules.milestone.repository.MilestoneRepository;
import com.ppmp.modules.technology.repository.TechnologyRepository;
import com.ppmp.modules.activity.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;
    private final TechnologyRepository technologyRepository;
    private final ActivityLogRepository activityLogRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(UUID userId) {
        Map<String, Long> byStatus = groupLong(projectRepository.countByStatus(userId));
        List<TechUsageDto> topTechnologies = projectRepository.countTechnologiesUsage(userId)
                .stream().limit(5)
                .map(row -> TechUsageDto.builder().technology((String) row[0]).usageCount((Long) row[1]).build())
                .toList();

        List<ActivityPointDto> recentActivity = activityLogRepository.findAll(
                        PageRequest.of(0, 8, org.springframework.data.domain.Sort.by(
                                org.springframework.data.domain.Sort.Direction.DESC, "createdAt")))
                .getContent().stream()
                .map(a -> ActivityPointDto.builder()
                        .username(a.getUser().getUsername())
                        .action(a.getAction())
                        .projectTitle(a.getProject().getTitle())
                        .createdAt(a.getCreatedAt())
                        .build())
                .toList();

        return DashboardStatsDto.builder()
                .totalProjects(projectRepository.findByOwnerId(userId, PageRequest.of(0, 1)).getTotalElements())
                .completedProjects(byStatus.getOrDefault("COMPLETED", 0L))
                .inProgressProjects(byStatus.getOrDefault("IN_PROGRESS", 0L))
                .planningProjects(byStatus.getOrDefault("PLANNING", 0L))
                .onHoldProjects(byStatus.getOrDefault("ON_HOLD", 0L))
                .archivedProjects(byStatus.getOrDefault("ARCHIVED", 0L))
                .totalTasks(taskRepository.countByOwnerId(userId))
                .completedTasks(taskRepository.countDoneByOwnerId(userId))
                .totalMilestones(milestoneRepository.countByOwnerId(userId))
                .completedMilestones(milestoneRepository.countCompletedByOwnerId(userId))
                .distinctTechnologies(technologyRepository.countDistinctForOwner(userId))
                .topTechnologies(topTechnologies)
                .recentActivity(recentActivity)
                .build();
    }

    @Transactional(readOnly = true)
    public ProjectStatsDto getProjectStats(UUID userId) {
        Map<String, Long> byStatus = groupLong(projectRepository.countByStatus(userId));
        Map<String, Long> byVisibility = groupLong(projectRepository.countByVisibility(userId));
        List<DailyCountDto> byDay = projectRepository.countCreatedByDay().stream()
                .map(row -> DailyCountDto.builder()
                        .date(((java.sql.Date) row[0]).toLocalDate())
                        .count((Long) row[1]).build())
                .toList();
        return ProjectStatsDto.builder()
                .total(byStatus.values().stream().mapToLong(Long::longValue).sum())
                .byStatus(byStatus)
                .byVisibility(byVisibility)
                .byDay(byDay)
                .build();
    }

    @Transactional(readOnly = true)
    public List<TechUsageDto> getTechUsage(UUID userId) {
        return projectRepository.countTechnologiesUsage(userId).stream()
                .map(row -> TechUsageDto.builder().technology((String) row[0]).usageCount((Long) row[1]).build())
                .toList();
    }

    private Map<String, Long> groupLong(List<Object[]> rows) {
        Map<String, Long> result = new LinkedHashMap<>();
        for (Object[] row : rows) {
            result.put(String.valueOf(row[0]), (Long) row[1]);
        }
        return result;
    }
}
