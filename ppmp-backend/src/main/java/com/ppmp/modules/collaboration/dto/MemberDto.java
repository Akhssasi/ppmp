package com.ppmp.modules.collaboration.dto;

import com.ppmp.shared.enums.MemberRole;
import com.ppmp.shared.enums.MemberStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private UUID id;
    private UUID projectId;
    private UUID userId;
    private String username;
    private String fullName;
    private String email;
    private String avatarUrl;
    private MemberRole role;
    private MemberStatus status;
    private LocalDateTime invitedAt;
    private LocalDateTime joinedAt;
}
