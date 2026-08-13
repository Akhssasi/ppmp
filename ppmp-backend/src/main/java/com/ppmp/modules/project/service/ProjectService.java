package com.ppmp.modules.project.service;

import com.ppmp.modules.activity.service.ActivityService;
import com.ppmp.modules.collaboration.repository.ProjectMemberRepository;
import com.ppmp.modules.milestone.repository.MilestoneRepository;
import com.ppmp.modules.project.dto.*;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.project.repository.ProjectRepository;
import com.ppmp.modules.task.repository.TaskRepository;
import com.ppmp.modules.technology.dto.TechnologyDto;
import com.ppmp.modules.technology.entity.Technology;
import com.ppmp.modules.technology.service.TechnologyService;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.enums.MemberStatus;
import com.ppmp.shared.enums.ProjectStatus;
import com.ppmp.shared.enums.ProjectVisibility;
import com.ppmp.shared.exception.BadRequestException;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import com.ppmp.shared.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TechnologyService technologyService;
    private final TaskRepository taskRepository;
    private final MilestoneRepository milestoneRepository;
    private final ProjectMemberRepository memberRepository;
    private final ActivityService activityService;

    @Transactional(readOnly = true)
    public PagedResponse<ProjectListDto> getMyProjects(UUID userId, String status, String tech, String visibility, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        Page<Project> projects;
        if (status != null && !status.isBlank()) {
            projects = projectRepository.findByOwnerIdAndStatus(userId, ProjectStatus.valueOf(status.toUpperCase()), pageable);
        } else if (visibility != null && !visibility.isBlank()) {
            projects = projectRepository.findByOwnerIdAndVisibility(userId, ProjectVisibility.valueOf(visibility.toUpperCase()), pageable);
        } else if (tech != null && !tech.isBlank()) {
            projects = projectRepository.findByOwnerAndTechnology(userId, UUID.fromString(tech), pageable);
        } else {
            projects = projectRepository.findByOwnerId(userId, pageable);
        }
        return PagedResponse.from(projects, this::toListDto);
    }

    @Transactional(readOnly = true)
    public ProjectDto getProject(UUID projectId, UUID userId) {
        Project project = getProjectEntity(projectId);
        if (!canAccess(project, userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return toDto(project, userId);
    }

    @Transactional
    public ProjectDto createProject(UUID ownerId, ProjectRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = Project.builder()
                .owner(owner)
                .title(request.getTitle())
                .shortDescription(request.getShortDescription())
                .fullDescription(request.getFullDescription())
                .status(request.getStatus() != null ? request.getStatus() : ProjectStatus.PLANNING)
                .visibility(request.getVisibility() != null ? request.getVisibility() : ProjectVisibility.PRIVATE)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .progressPercentage(request.getProgressPercentage() != null ? request.getProgressPercentage() : 0)
                .repoUrl(request.getRepoUrl())
                .liveDemoUrl(request.getLiveDemoUrl())
                .videoDemoUrl(request.getVideoDemoUrl())
                .thumbnailUrl(request.getThumbnailUrl())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false)
                .build();

        if (request.getTechnologyIds() != null && !request.getTechnologyIds().isEmpty()) {
            project.setTechnologies(technologyService.findByIds(request.getTechnologyIds()));
        }

        Project saved = projectRepository.save(project);
        activityService.log(saved, owner, "PROJECT_CREATED", "Created project \"" + saved.getTitle() + "\"");
        return toDto(saved, ownerId);
    }

    @Transactional
    public ProjectDto updateProject(UUID projectId, UUID userId, ProjectRequest request) {
        Project project = getOwnedProject(projectId, userId);
        if (request.getTitle() != null) {
            project.setTitle(request.getTitle());
        }
        if (request.getShortDescription() != null) {
            project.setShortDescription(request.getShortDescription());
        }
        if (request.getFullDescription() != null) {
            project.setFullDescription(request.getFullDescription());
        }
        if (request.getStatus() != null) {
            project.setStatus(request.getStatus());
        }
        if (request.getVisibility() != null) {
            project.setVisibility(request.getVisibility());
        }
        if (request.getStartDate() != null) {
            project.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            project.setEndDate(request.getEndDate());
        }
        if (request.getProgressPercentage() != null) {
            validateProgress(request.getProgressPercentage());
            project.setProgressPercentage(request.getProgressPercentage());
        }
        if (request.getRepoUrl() != null) {
            project.setRepoUrl(request.getRepoUrl());
        }
        if (request.getLiveDemoUrl() != null) {
            project.setLiveDemoUrl(request.getLiveDemoUrl());
        }
        if (request.getVideoDemoUrl() != null) {
            project.setVideoDemoUrl(request.getVideoDemoUrl());
        }
        if (request.getThumbnailUrl() != null) {
            project.setThumbnailUrl(request.getThumbnailUrl());
        }
        if (request.getIsFeatured() != null) {
            project.setIsFeatured(request.getIsFeatured());
        }
        if (request.getTechnologyIds() != null) {
            project.setTechnologies(technologyService.findByIds(request.getTechnologyIds()));
        }
        Project saved = projectRepository.save(project);
        activityService.log(saved, userRepository.findById(userId).orElseThrow(), "PROJECT_UPDATED", "Updated project \"" + saved.getTitle() + "\"");
        return toDto(saved, userId);
    }

    @Transactional
    public void deleteProject(UUID projectId, UUID userId) {
        Project project = getOwnedProject(projectId, userId);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDto updateStatus(UUID projectId, UUID userId, ProjectStatus status) {
        Project project = getOwnedProject(projectId, userId);
        project.setStatus(status);
        if (status == ProjectStatus.COMPLETED) {
            project.setProgressPercentage(100);
        }
        Project saved = projectRepository.save(project);
        activityService.log(saved, userRepository.findById(userId).orElseThrow(), "STATUS_CHANGED", "Status changed to " + status);
        return toDto(saved, userId);
    }

    @Transactional
    public ProjectDto updateVisibility(UUID projectId, UUID userId, ProjectVisibility visibility) {
        Project project = getOwnedProject(projectId, userId);
        project.setVisibility(visibility);
        Project saved = projectRepository.save(project);
        activityService.log(saved, userRepository.findById(userId).orElseThrow(), "VISIBILITY_CHANGED", "Visibility changed to " + visibility);
        return toDto(saved, userId);
    }

    @Transactional
    public ProjectDto duplicateProject(UUID projectId, UUID userId) {
        Project source = getOwnedProject(projectId, userId);
        Project copy = Project.builder()
                .owner(source.getOwner())
                .title(source.getTitle() + " (copy)")
                .shortDescription(source.getShortDescription())
                .fullDescription(source.getFullDescription())
                .status(ProjectStatus.PLANNING)
                .visibility(ProjectVisibility.PRIVATE)
                .startDate(source.getStartDate())
                .endDate(source.getEndDate())
                .progressPercentage(0)
                .repoUrl(source.getRepoUrl())
                .liveDemoUrl(source.getLiveDemoUrl())
                .videoDemoUrl(source.getVideoDemoUrl())
                .thumbnailUrl(source.getThumbnailUrl())
                .isFeatured(false)
                .technologies(new HashSet<>(source.getTechnologies()))
                .build();
        Project saved = projectRepository.save(copy);
        activityService.log(saved, source.getOwner(), "PROJECT_DUPLICATED", "Duplicated from \"" + source.getTitle() + "\"");
        return toDto(saved, userId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<com.ppmp.modules.activity.dto.ActivityDto> getProjectActivity(UUID projectId, UUID userId, int page, int size) {
        Project project = getProjectEntity(projectId);
        if (!canAccess(project, userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return activityService.getProjectActivity(projectId,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
    }

    @Transactional(readOnly = true)
    public Project getProjectEntity(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private Project getOwnedProject(UUID projectId, UUID userId) {
        Project project = getProjectEntity(projectId);
        if (!project.getOwner().getId().equals(userId)) {
            throw new UnauthorizedException("Only the project owner can perform this action");
        }
        return project;
    }

    public boolean canAccess(Project project, UUID userId) {
        if (project.getOwner().getId().equals(userId)) {
            return true;
        }
        if (project.getVisibility() == ProjectVisibility.PUBLIC) {
            return true;
        }
        return memberRepository.existsByProjectIdAndUserId(project.getId(), userId);
    }

    public boolean canEdit(Project project, UUID userId) {
        if (project.getOwner().getId().equals(userId)) {
            return true;
        }
        return memberRepository.findByProjectIdAndUserIdAndStatus(project.getId(), userId, MemberStatus.ACTIVE)
                .map(m -> m.getRole() == com.ppmp.shared.enums.MemberRole.TEAM_LEAD
                        || m.getRole() == com.ppmp.shared.enums.MemberRole.CONTRIBUTOR)
                .orElse(false);
    }

    private void validateProgress(int progress) {
        if (progress < 0 || progress > 100) {
            throw new BadRequestException("Progress must be between 0 and 100");
        }
    }

    public ProjectListDto toListDto(Project project) {
        return ProjectListDto.builder()
                .id(project.getId())
                .title(project.getTitle())
                .shortDescription(project.getShortDescription())
                .status(project.getStatus())
                .visibility(project.getVisibility())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .progressPercentage(project.getProgressPercentage())
                .thumbnailUrl(project.getThumbnailUrl())
                .technologyNames(project.getTechnologies().stream().map(Technology::getName).collect(java.util.stream.Collectors.toSet()))
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    public ProjectDto toDto(Project project, UUID viewerId) {
        return ProjectDto.builder()
                .id(project.getId())
                .ownerId(project.getOwner().getId())
                .ownerUsername(project.getOwner().getUsername())
                .title(project.getTitle())
                .shortDescription(project.getShortDescription())
                .fullDescription(project.getFullDescription())
                .status(project.getStatus())
                .visibility(project.getVisibility())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .progressPercentage(project.getProgressPercentage())
                .repoUrl(project.getRepoUrl())
                .liveDemoUrl(project.getLiveDemoUrl())
                .videoDemoUrl(project.getVideoDemoUrl())
                .thumbnailUrl(project.getThumbnailUrl())
                .isFeatured(project.getIsFeatured())
                .technologies(project.getTechnologies().stream().map(t -> TechnologyDto.builder()
                        .id(t.getId()).name(t.getName()).category(t.getCategory()).iconUrl(t.getIconUrl()).build())
                        .collect(java.util.stream.Collectors.toSet()))
                .taskCount(taskRepository.countByProjectId(project.getId()))
                .completedTaskCount(taskRepository.countByProjectIdAndStatus(project.getId(), com.ppmp.shared.enums.TaskStatus.DONE))
                .milestoneCount(milestoneRepository.countByProjectId(project.getId()))
                .completedMilestoneCount(milestoneRepository.countByProjectIdAndIsCompletedTrue(project.getId()))
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
