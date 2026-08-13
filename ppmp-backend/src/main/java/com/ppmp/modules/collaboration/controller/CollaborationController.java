package com.ppmp.modules.collaboration.controller;

import com.ppmp.modules.collaboration.dto.InviteMemberRequest;
import com.ppmp.modules.collaboration.dto.MemberDto;
import com.ppmp.modules.collaboration.dto.RoleUpdateRequest;
import com.ppmp.modules.collaboration.entity.Invitation;
import com.ppmp.modules.collaboration.service.CollaborationService;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Collaboration")
public class CollaborationController {

    private final CollaborationService collaborationService;

    @PostMapping("/projects/{id}/members/invite")
    public ResponseEntity<ApiResponse<String>> invite(@PathVariable UUID id,
                                                      @Valid @RequestBody InviteMemberRequest request) {
        Invitation invitation = collaborationService.invite(id, SecurityUtil.getCurrentUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Invitation sent", invitation.getToken()));
    }

    @GetMapping("/projects/{id}/members")
    public ResponseEntity<ApiResponse<List<MemberDto>>> getMembers(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Project members",
                collaborationService.getMembers(id, SecurityUtil.getCurrentUserId())));
    }

    @DeleteMapping("/projects/{id}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(@PathVariable UUID id, @PathVariable UUID userId) {
        collaborationService.removeMember(id, userId, SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Member removed", null));
    }

    @PutMapping("/projects/{id}/members/{userId}/role")
    public ResponseEntity<ApiResponse<MemberDto>> updateRole(@PathVariable UUID id, @PathVariable UUID userId,
                                                             @Valid @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Member role updated",
                collaborationService.updateRole(id, userId, SecurityUtil.getCurrentUserId(), request.getRole())));
    }

    @PostMapping("/invitations/{token}/accept")
    public ResponseEntity<ApiResponse<String>> acceptInvitation(@PathVariable String token) {
        return ResponseEntity.ok(ApiResponse.ok("Success",
                collaborationService.acceptInvitation(token, SecurityUtil.getCurrentUserId())));
    }

    @PostMapping("/invitations/{token}/reject")
    public ResponseEntity<ApiResponse<String>> rejectInvitation(@PathVariable String token) {
        return ResponseEntity.ok(ApiResponse.ok("Success",
                collaborationService.rejectInvitation(token, SecurityUtil.getCurrentUserId())));
    }
}
