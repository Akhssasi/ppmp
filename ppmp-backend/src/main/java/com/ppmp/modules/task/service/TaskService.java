package com.ppmp.modules.task.service;

import com.ppmp.modules.notification.service.NotificationService;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.modules.task.dto.TaskDto;
import com.ppmp.modules.task.dto.TaskRequest;
import com.ppmp.modules.task.dto.TaskStatusRequest;
import com.ppmp.modules.task.entity.Task;
import com.ppmp.modules.task.repository.TaskRepository;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.enums.NotificationType;
import com.ppmp.shared.enums.TaskStatus;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import com.ppmp.shared.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TaskDto> getTasks(UUID projectId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canAccess(project, userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return taskRepository.findByProjectIdOrderByCreatedAtAsc(projectId).stream().map(this::toDto).toList();
    }

    @Transactional
    public TaskDto createTask(UUID projectId, UUID userId, TaskRequest request) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to create tasks in this project");
        }
        User assignee = null;
        if (request.getAssignedToId() != null) {
            assignee = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User to assign not found"));
        }
        Task task = Task.builder()
                .project(project)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : com.ppmp.shared.enums.TaskPriority.MEDIUM)
                .dueDate(request.getDueDate())
                .assignedTo(assignee)
                .build();
        Task saved = taskRepository.save(task);
        if (assignee != null && !assignee.getId().equals(userId)) {
            notificationService.notify(assignee, NotificationType.TASK_ASSIGNED,
                    "You have been assigned a new task \"" + saved.getTitle() + "\" in project \"" + project.getTitle() + "\"",
                    saved.getId());
        }
        return toDto(saved);
    }

    @Transactional
    public TaskDto updateTask(UUID projectId, UUID taskId, UUID userId, TaskRequest request) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to update tasks in this project");
        }
        Task task = getTask(projectId, taskId);
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getAssignedToId() != null) {
            task.setAssignedTo(userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User to assign not found")));
        }
        return toDto(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(UUID projectId, UUID taskId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to delete tasks in this project");
        }
        taskRepository.delete(getTask(projectId, taskId));
    }

    @Transactional
    public TaskDto updateStatus(UUID projectId, UUID taskId, UUID userId, TaskStatus status) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to update tasks in this project");
        }
        Task task = getTask(projectId, taskId);
        task.setStatus(status);
        return toDto(taskRepository.save(task));
    }

    @Transactional
    public TaskDto assignTask(UUID projectId, UUID taskId, UUID userId, UUID assigneeId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to assign tasks in this project");
        }
        Task task = getTask(projectId, taskId);
        User assignee = userRepository.findById(assigneeId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        task.setAssignedTo(assignee);
        Task saved = taskRepository.save(task);
        if (!assignee.getId().equals(userId)) {
            notificationService.notify(assignee, NotificationType.TASK_ASSIGNED,
                    "You have been assigned task \"" + saved.getTitle() + "\" in project \"" + project.getTitle() + "\"",
                    saved.getId());
        }
        return toDto(saved);
    }

    private Task getTask(UUID projectId, UUID taskId) {
        return taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found in this project"));
    }

    private TaskDto toDto(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .projectId(task.getProject().getId())
                .assignedToId(task.getAssignedTo() != null ? task.getAssignedTo().getId() : null)
                .assignedToUsername(task.getAssignedTo() != null ? task.getAssignedTo().getUsername() : null)
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
