package com.ppmp.modules.project.controller;

import com.ppmp.modules.activity.dto.ActivityDto;
import com.ppmp.modules.project.dto.*;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.shared.constants.AppConstants;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.response.PagedResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Projects")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<ProjectListDto>>> getMyProjects(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String tech,
            @RequestParam(required = false) String visibility,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(ApiResponse.ok("Projects",
                projectService.getMyProjects(SecurityUtil.getCurrentUserId(), status, tech, visibility, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProject(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Project",
                projectService.getProject(id, SecurityUtil.getCurrentUserId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Project created",
                        projectService.createProject(SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(@PathVariable UUID id,
                                                                 @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project updated",
                projectService.updateProject(id, SecurityUtil.getCurrentUserId(), request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) {
        projectService.deleteProject(id, SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Project deleted", null));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProjectDto>> updateStatus(@PathVariable UUID id,
                                                                @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project status updated",
                projectService.updateStatus(id, SecurityUtil.getCurrentUserId(), request.getStatus())));
    }

    @PatchMapping("/{id}/visibility")
    public ResponseEntity<ApiResponse<ProjectDto>> updateVisibility(@PathVariable UUID id,
                                                                    @Valid @RequestBody VisibilityUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Project visibility updated",
                projectService.updateVisibility(id, SecurityUtil.getCurrentUserId(), request.getVisibility())));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ApiResponse<ProjectDto>> duplicateProject(@PathVariable UUID id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Project duplicated",
                        projectService.duplicateProject(id, SecurityUtil.getCurrentUserId())));
    }

    @GetMapping("/{id}/activity")
    public ResponseEntity<ApiResponse<PagedResponse<ActivityDto>>> getProjectActivity(
            @PathVariable UUID id,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return ResponseEntity.ok(ApiResponse.ok("Project activity",
                projectService.getProjectActivity(id, SecurityUtil.getCurrentUserId(), page, size)));
    }
}
