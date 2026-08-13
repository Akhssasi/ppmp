package com.ppmp.modules.user.service;

import com.ppmp.infrastructure.storage.StorageService;
import com.ppmp.modules.user.dto.ChangePasswordRequest;
import com.ppmp.modules.user.dto.PublicUserDto;
import com.ppmp.modules.user.dto.UpdateProfileRequest;
import com.ppmp.modules.user.dto.UserDto;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.exception.BadRequestException;
import com.ppmp.shared.exception.DuplicateResourceException;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import com.ppmp.shared.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(UUID userId) {
        return toDto(getUser(userId));
    }

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = getUser(userId);
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getPortfolioSlug() != null && !request.getPortfolioSlug().isBlank()) {
            String newSlug = SlugUtil.toSlug(request.getPortfolioSlug());
            if (!newSlug.equals(user.getPortfolioSlug())
                    && userRepository.existsByPortfolioSlug(newSlug)) {
                throw new DuplicateResourceException("This portfolio link is already taken");
            }
            user.setPortfolioSlug(newSlug);
        }
        return toDto(userRepository.save(user));
    }

    @Transactional
    public UserDto updateAvatar(UUID userId, MultipartFile file) {
        User user = getUser(userId);
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select an image to upload");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Avatar image must be under 5MB");
        }
        try {
            String url = storageService.upload(file, "avatars");
            user.setAvatarUrl(url);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to upload avatar: " + ex.getMessage());
        }
        return toDto(userRepository.save(user));
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = getUser(userId);
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deleteAccount(UUID userId) {
        User user = getUser(userId);
        user.setIsActive(false);
        user.setEmail(user.getEmail() + ".deleted-" + UUID.randomUUID().hashCode());
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public PublicUserDto getPublicUser(String username) {
        User user = userRepository.findByPortfolioSlug(username)
                .or(() -> userRepository.findByUsername(username))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!user.getIsActive()) {
            throw new ResourceNotFoundException("User not found");
        }
        return PublicUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .portfolioSlug(user.getPortfolioSlug())
                .build();
    }

    public User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("User not found"));
    }

    public UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .portfolioSlug(user.getPortfolioSlug())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
