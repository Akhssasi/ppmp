package com.ppmp.modules.milestone.service;

import com.ppmp.modules.milestone.dto.MilestoneDto;
import com.ppmp.modules.milestone.dto.MilestoneRequest;
import com.ppmp.modules.milestone.entity.Milestone;
import com.ppmp.modules.milestone.repository.MilestoneRepository;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectService projectService;

    @Transactional(readOnly = true)
    public List<MilestoneDto> getMilestones(UUID projectId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canAccess(project, userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return milestoneRepository.findByProjectIdOrderByTargetDateAsc(projectId).stream().map(this::toDto).toList();
    }

    @Transactional
    public MilestoneDto createMilestone(UUID projectId, UUID userId, MilestoneRequest request) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to manage milestones in this project");
        }
        Milestone milestone = Milestone.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .targetDate(request.getTargetDate())
                .build();
        return toDto(milestoneRepository.save(milestone));
    }

    @Transactional
    public MilestoneDto updateMilestone(UUID projectId, UUID milestoneId, UUID userId, MilestoneRequest request) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to manage milestones in this project");
        }
        Milestone milestone = getMilestone(projectId, milestoneId);
        if (request.getTitle() != null) {
            milestone.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            milestone.setDescription(request.getDescription());
        }
        if (request.getTargetDate() != null) {
            milestone.setTargetDate(request.getTargetDate());
        }
        return toDto(milestoneRepository.save(milestone));
    }

    @Transactional
    public void deleteMilestone(UUID projectId, UUID milestoneId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to manage milestones in this project");
        }
        milestoneRepository.delete(getMilestone(projectId, milestoneId));
    }

    @Transactional
    public MilestoneDto toggleComplete(UUID projectId, UUID milestoneId, UUID userId, boolean complete) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to manage milestones in this project");
        }
        Milestone milestone = getMilestone(projectId, milestoneId);
        if (complete && !milestone.getIsCompleted()) {
            milestone.markCompleted();
        } else if (!complete) {
            milestone.setIsCompleted(false);
            milestone.setCompletedAt(null);
        }
        return toDto(milestoneRepository.save(milestone));
    }

    private Milestone getMilestone(UUID projectId, UUID milestoneId) {
        return milestoneRepository.findByIdAndProjectId(milestoneId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found in this project"));
    }

    private MilestoneDto toDto(Milestone milestone) {
        return MilestoneDto.builder()
                .id(milestone.getId())
                .projectId(milestone.getProject().getId())
                .title(milestone.getTitle())
                .description(milestone.getDescription())
                .targetDate(milestone.getTargetDate())
                .isCompleted(milestone.getIsCompleted())
                .completedAt(milestone.getCompletedAt())
                .createdAt(milestone.getCreatedAt())
                .build();
    }
}
