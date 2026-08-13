package com.ppmp.modules.project.dto;

import com.ppmp.shared.enums.ProjectStatus;
import com.ppmp.shared.enums.ProjectVisibility;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Project title is required")
    @Size(max = 150)
    private String title;

    @Size(max = 500)
    private String shortDescription;

    private String fullDescription;

    private ProjectStatus status;

    private ProjectVisibility visibility;

    private LocalDate startDate;

    private LocalDate endDate;

    @Min(value = 0, message = "Progress must be between 0 and 100")
    @Max(value = 100, message = "Progress must be between 0 and 100")
    private Integer progressPercentage;

    @Size(max = 500)
    private String repoUrl;

    @Size(max = 500)
    private String liveDemoUrl;

    @Size(max = 500)
    private String videoDemoUrl;

    @Size(max = 500)
    private String thumbnailUrl;

    private Boolean isFeatured;

    private Set<UUID> technologyIds;
}
