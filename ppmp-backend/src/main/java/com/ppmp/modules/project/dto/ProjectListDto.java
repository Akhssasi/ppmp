package com.ppmp.modules.project.dto;

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
public class ProjectListDto {
    private UUID id;
    private String title;
    private String shortDescription;
    private ProjectStatus status;
    private ProjectVisibility visibility;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer progressPercentage;
    private String thumbnailUrl;
    private Set<String> technologyNames;
    private LocalDateTime updatedAt;
}
