package com.ppmp.modules.admin.controller;

import com.ppmp.modules.admin.dto.AnnouncementRequest;
import com.ppmp.modules.admin.dto.PlatformStatsDto;
import com.ppmp.modules.admin.dto.UserAdminDto;
import com.ppmp.modules.admin.service.AdminService;
import com.ppmp.modules.project.dto.ProjectListDto;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.shared.constants.AppConstants;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.response.PagedResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin")
public class AdminController {

    private final AdminService adminService;
    private final ProjectService projectService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserAdminDto>>> getUsers(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok("Users", adminService.getUsers(page, size, search)));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserAdminDto>> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("User", adminService.getUser(id)));
    }

    @PatchMapping("/users/{id}/ban")
    public ResponseEntity<ApiResponse<UserAdminDto>> banUser(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("User banned", adminService.banUser(id)));
    }

    @PatchMapping("/users/{id}/activate")
    public ResponseEntity<ApiResponse<UserAdminDto>> activateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("User activated", adminService.activateUser(id)));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable UUID id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<PagedResponse<ProjectListDto>>> getProjects(
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
            @RequestParam(defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
        var projectsPage = adminService.getAllProjects(pageable);
        return ResponseEntity.ok(ApiResponse.ok("Projects",
                PagedResponse.from(
                        new org.springframework.data.domain.PageImpl<>(projectsPage.getContent(), pageable,
                                projectsPage.getTotalElements()),
                        projectService::toListDto)));
    }

    @GetMapping("/analytics/platform")
    public ResponseEntity<ApiResponse<PlatformStatsDto>> getPlatformStats() {
        return ResponseEntity.ok(ApiResponse.ok("Platform stats", adminService.getPlatformStats()));
    }

    @PostMapping("/announcements")
    public ResponseEntity<ApiResponse<Void>> createAnnouncement(@Valid @RequestBody AnnouncementRequest request) {
        adminService.createAnnouncement(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Announcement sent", null));
    }
}
