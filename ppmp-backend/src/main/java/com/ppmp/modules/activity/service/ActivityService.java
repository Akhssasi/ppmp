package com.ppmp.modules.activity.service;

import com.ppmp.modules.activity.dto.ActivityDto;
import com.ppmp.modules.activity.entity.ActivityLog;
import com.ppmp.modules.activity.repository.ActivityLogRepository;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.user.entity.User;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.response.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public void log(Project project, User user, String action, String details) {
        ActivityLog log = ActivityLog.builder()
                .project(project)
                .user(user)
                .action(action)
                .details(details)
                .build();
        activityLogRepository.save(log);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ActivityDto> getProjectActivity(UUID projectId, Pageable pageable) {
        Page<ActivityLog> page = activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId, pageable);
        return PagedResponse.from(page, this::toDto);
    }

    @Transactional(readOnly = true)
    public ActivityDto getActivityById(UUID projectId, UUID activityId) {
        ActivityLog activity = activityLogRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        return toDto(activity);
    }

    private ActivityDto toDto(ActivityLog log) {
        return ActivityDto.builder()
                .id(log.getId())
                .projectId(log.getProject().getId())
                .userId(log.getUser().getId())
                .username(log.getUser().getUsername())
                .action(log.getAction())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
