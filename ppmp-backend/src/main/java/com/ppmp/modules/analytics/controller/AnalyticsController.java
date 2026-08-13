package com.ppmp.modules.analytics.controller;

import com.ppmp.modules.analytics.dto.DashboardStatsDto;
import com.ppmp.modules.analytics.dto.ProjectStatsDto;
import com.ppmp.modules.analytics.dto.TechUsageDto;
import com.ppmp.modules.analytics.service.AnalyticsService;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard stats",
                analyticsService.getDashboardStats(SecurityUtil.getCurrentUserId())));
    }

    @GetMapping("/projects/stats")
    public ResponseEntity<ApiResponse<ProjectStatsDto>> getProjectStats() {
        return ResponseEntity.ok(ApiResponse.ok("Project stats",
                analyticsService.getProjectStats(SecurityUtil.getCurrentUserId())));
    }

    @GetMapping("/technologies/usage")
    public ResponseEntity<ApiResponse<List<TechUsageDto>>> getTechUsage() {
        return ResponseEntity.ok(ApiResponse.ok("Technology usage",
                analyticsService.getTechUsage(SecurityUtil.getCurrentUserId())));
    }
}
