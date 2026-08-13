package com.ppmp.modules.project.dto;

import com.ppmp.modules.technology.dto.TechnologyDto;
import com.ppmp.shared.enums.ProjectStatus;
import com.ppmp.shared.enums.ProjectVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private UUID id;
    private UUID ownerId;
    private String ownerUsername;
    private String title;
    private String shortDescription;
    private String fullDescription;
    private ProjectStatus status;
    private ProjectVisibility visibility;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer progressPercentage;
    private String repoUrl;
    private String liveDemoUrl;
    private String videoDemoUrl;
    private String thumbnailUrl;
    private Boolean isFeatured;
    private Set<TechnologyDto> technologies;
    private long taskCount;
    private long completedTaskCount;
    private long milestoneCount;
    private long completedMilestoneCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
