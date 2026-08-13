package com.ppmp.modules.collaboration.service;

import com.ppmp.infrastructure.email.EmailService;
import com.ppmp.modules.collaboration.dto.InviteMemberRequest;
import com.ppmp.modules.collaboration.dto.MemberDto;
import com.ppmp.modules.collaboration.entity.Invitation;
import com.ppmp.modules.collaboration.entity.ProjectMember;
import com.ppmp.modules.collaboration.repository.InvitationRepository;
import com.ppmp.modules.collaboration.repository.ProjectMemberRepository;
import com.ppmp.modules.notification.service.NotificationService;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.enums.InvitationStatus;
import com.ppmp.shared.enums.MemberRole;
import com.ppmp.shared.enums.MemberStatus;
import com.ppmp.shared.enums.NotificationType;
import com.ppmp.shared.exception.BadRequestException;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollaborationService {

    private final ProjectMemberRepository memberRepository;
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;
    private final NotificationService notificationService;
    private final EmailService emailService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Transactional
    public Invitation invite(UUID projectId, UUID inviterId, InviteMemberRequest request) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, inviterId)) {
            throw new UnauthorizedException("You do not have permission to invite members");
        }
        String email = request.getEmail().trim().toLowerCase();
        userRepository.findByEmail(email).ifPresent(existing -> {
            if (memberRepository.existsByProjectIdAndUserId(projectId, existing.getId())) {
                throw new BadRequestException("This user is already a member of the project");
            }
        });
        if (invitationRepository.existsByProjectIdAndEmailAndStatus(projectId, email, InvitationStatus.PENDING)) {
            throw new BadRequestException("An invitation is already pending for this email");
        }
        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Invitation invitation = Invitation.builder()
                .token(UUID.randomUUID().toString())
                .project(project)
                .inviter(inviter)
                .email(email)
                .memberRole(MemberRole.CONTRIBUTOR)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        Invitation saved = invitationRepository.save(invitation);

        userRepository.findByEmail(email).ifPresent(target ->
                notificationService.notify(target, NotificationType.COLLAB_INVITE,
                        "You've been invited to collaborate on \"" + project.getTitle() + "\"", project.getId()));

        emailService.sendInvitationEmail(email, saved.getToken(), project.getTitle(),
                inviter.getFullName(), frontendUrl);
        return saved;
    }

    @Transactional(readOnly = true)
    public List<MemberDto> getMembers(UUID projectId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canAccess(project, userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return memberRepository.findByProjectId(projectId).stream().map(this::toDto).toList();
    }

    @Transactional
    public void removeMember(UUID projectId, UUID memberUserId, UUID requesterId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!project.getOwner().getId().equals(requesterId)) {
            throw new UnauthorizedException("Only the project owner can remove members");
        }
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        memberRepository.delete(member);
    }

    @Transactional
    public MemberDto updateRole(UUID projectId, UUID memberUserId, UUID requesterId, MemberRole role) {
        Project project = projectService.getProjectEntity(projectId);
        if (!project.getOwner().getId().equals(requesterId)) {
            throw new UnauthorizedException("Only the project owner can change member roles");
        }
        ProjectMember member = memberRepository.findByProjectIdAndUserId(projectId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        member.setRole(role);
        return toDto(memberRepository.save(member));
    }

    @Transactional
    public String acceptInvitation(String token, UUID userId) {
        Invitation invitation = getValidInvitation(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!invitation.getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new UnauthorizedException("This invitation was sent to a different email address");
        }
        ProjectMember member = memberRepository.findByProjectIdAndUserId(invitation.getProject().getId(), userId)
                .orElseGet(() -> ProjectMember.builder()
                        .project(invitation.getProject())
                        .user(user)
                        .role(invitation.getMemberRole())
                        .status(MemberStatus.ACTIVE)
                        .joinedAt(LocalDateTime.now())
                        .build());
        memberRepository.save(member);
        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);
        notificationService.notify(invitation.getInviter(), NotificationType.COLLAB_INVITE,
                user.getFullName() + " accepted your invitation to \"" + invitation.getProject().getTitle() + "\"",
                invitation.getProject().getId());
        return "Invitation accepted";
    }

    @Transactional
    public String rejectInvitation(String token, UUID userId) {
        Invitation invitation = getValidInvitation(token);
        invitation.setStatus(InvitationStatus.REJECTED);
        invitationRepository.save(invitation);
        return "Invitation rejected";
    }

    private Invitation getValidInvitation(String token) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));
        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("Invitation is no longer pending");
        }
        if (invitation.isExpired()) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            invitationRepository.save(invitation);
            throw new BadRequestException("Invitation has expired");
        }
        return invitation;
    }

    private MemberDto toDto(ProjectMember member) {
        User user = member.getUser();
        return MemberDto.builder()
                .id(member.getId())
                .projectId(member.getProject().getId())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(member.getRole())
                .status(member.getStatus())
                .invitedAt(member.getInvitedAt())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
