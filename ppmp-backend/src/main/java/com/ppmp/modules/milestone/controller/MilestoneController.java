package com.ppmp.modules.milestone.controller;

import com.ppmp.modules.milestone.dto.MilestoneDto;
import com.ppmp.modules.milestone.dto.MilestoneRequest;
import com.ppmp.modules.milestone.service.MilestoneService;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{id}/milestones")
@RequiredArgsConstructor
@Tag(name = "Milestones")
public class MilestoneController {

    private final MilestoneService milestoneService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MilestoneDto>>> getMilestones(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Milestones",
                milestoneService.getMilestones(id, SecurityUtil.getCurrentUserId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MilestoneDto>> createMilestone(@PathVariable UUID id,
                                                                     @Valid @RequestBody MilestoneRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Milestone created",
                        milestoneService.createMilestone(id, SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping("/{mId}")
    public ResponseEntity<ApiResponse<MilestoneDto>> updateMilestone(@PathVariable UUID id, @PathVariable UUID mId,
                                                                     @Valid @RequestBody MilestoneRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Milestone updated",
                milestoneService.updateMilestone(id, mId, SecurityUtil.getCurrentUserId(), request)));
    }

    @DeleteMapping("/{mId}")
    public ResponseEntity<ApiResponse<Void>> deleteMilestone(@PathVariable UUID id, @PathVariable UUID mId) {
        milestoneService.deleteMilestone(id, mId, SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Milestone deleted", null));
    }

    @PatchMapping("/{mId}/complete")
    public ResponseEntity<ApiResponse<MilestoneDto>> toggleComplete(@PathVariable UUID id, @PathVariable UUID mId,
                                                                    @RequestBody(required = false) CompleteRequest request) {
        boolean complete = request == null || request.completed() == null || request.completed();
        return ResponseEntity.ok(ApiResponse.ok("Milestone updated",
                milestoneService.toggleComplete(id, mId, SecurityUtil.getCurrentUserId(), complete)));
    }

    public record CompleteRequest(Boolean completed) {}
}
