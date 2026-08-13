package com.ppmp.modules.admin.dto;

import com.ppmp.shared.enums.Role;
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
public class UserAdminDto {
    private UUID id;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private Role role;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private long projectCount;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
