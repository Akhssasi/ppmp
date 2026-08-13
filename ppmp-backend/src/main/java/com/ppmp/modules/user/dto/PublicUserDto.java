package com.ppmp.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserDto {
    private UUID id;
    private String username;
    private String fullName;
    private String bio;
    private String avatarUrl;
    private String portfolioSlug;
}
