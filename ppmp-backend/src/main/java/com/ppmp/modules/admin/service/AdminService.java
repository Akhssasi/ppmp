package com.ppmp.modules.admin.service;

import com.ppmp.modules.admin.dto.AdminTechUsageDto;
import com.ppmp.modules.admin.dto.AnnouncementRequest;
import com.ppmp.modules.admin.dto.PlatformStatsDto;
import com.ppmp.modules.admin.dto.UserAdminDto;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.notification.service.NotificationService;
import com.ppmp.modules.project.repository.ProjectRepository;
import com.ppmp.modules.task.repository.TaskRepository;
import com.ppmp.modules.file.repository.ProjectFileRepository;
import com.ppmp.modules.technology.repository.TechnologyRepository;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.enums.NotificationType;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ProjectFileRepository fileRepository;
    private final TechnologyRepository technologyRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public PagedResponse<UserAdminDto> getUsers(int page, int size, String search) {
        Page<User> users;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (search != null && !search.isBlank()) {
            users = userRepository.search(search, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return PagedResponse.from(users, u -> UserAdminDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .avatarUrl(u.getAvatarUrl())
                .role(u.getRole())
                .isActive(u.getIsActive())
                .isEmailVerified(u.getIsEmailVerified())
                .projectCount(projectRepository.countByOwnerId(u.getId()))
                .createdAt(u.getCreatedAt())
                .build());
    }

    @Transactional(readOnly = true)
    public UserAdminDto getUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserAdminDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .projectCount(projectRepository.countByOwnerId(user.getId()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public UserAdminDto banUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(false);
        return getUser(userRepository.save(user).getId());
    }

    @Transactional
    public UserAdminDto activateUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setIsActive(true);
        return getUser(userRepository.save(user).getId());
    }

    @Transactional
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Project> getAllProjects(Pageable pageable) {
        return projectRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public PlatformStatsDto getPlatformStats() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        Map<String, Long> byStatus = new LinkedHashMap<>();
        Map<String, Long> byVisibility = new LinkedHashMap<>();
        for (Object[] row : projectRepository.countAllByStatus()) {
            byStatus.put(String.valueOf(row[0]), (Long) row[1]);
        }
        for (Object[] row : projectRepository.countAllByVisibility()) {
            byVisibility.put(String.valueOf(row[0]), (Long) row[1]);
        }
        var topTechnologies = technologyRepository.countAllUsage().stream().limit(10)
                .map(row -> AdminTechUsageDto.builder()
                        .technology((String) row[0]).usageCount((Long) row[1]).build())
                .toList();

        return PlatformStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalProjects(projectRepository.count())
                .totalTasks(taskRepository.count())
                .totalFiles(fileRepository.count())
                .totalActiveUsers(userRepository.countByIsActive(true))
                .newUsersToday(userRepository.countByCreatedAtAfter(todayStart))
                .newProjectsToday(projectRepository.countByCreatedAtAfter(todayStart))
                .projectsByStatus(byStatus)
                .projectsByVisibility(byVisibility)
                .topTechnologies(topTechnologies)
                .build();
    }

    @Transactional
    public void createAnnouncement(AnnouncementRequest request) {
        String message = "[ANNOUNCEMENT] " + request.getTitle() + ": " + request.getMessage();
        userRepository.findAll().forEach(user -> {
            if (Boolean.TRUE.equals(user.getIsActive())) {
                notificationService.notify(user, NotificationType.SYSTEM, message, null);
            }
        });
    }
}
