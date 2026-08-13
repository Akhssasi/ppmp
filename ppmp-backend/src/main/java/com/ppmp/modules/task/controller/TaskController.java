package com.ppmp.modules.task.controller;

import com.ppmp.modules.task.dto.TaskDto;
import com.ppmp.modules.task.dto.TaskRequest;
import com.ppmp.modules.task.dto.TaskStatusRequest;
import com.ppmp.modules.task.service.TaskService;
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
@RequestMapping("/api/v1/projects/{id}/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks")
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskDto>>> getTasks(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Tasks", taskService.getTasks(id, SecurityUtil.getCurrentUserId())));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskDto>> createTask(@PathVariable UUID id,
                                                           @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Task created",
                        taskService.createTask(id, SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskDto>> updateTask(@PathVariable UUID id, @PathVariable UUID taskId,
                                                           @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task updated",
                taskService.updateTask(id, taskId, SecurityUtil.getCurrentUserId(), request)));
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable UUID id, @PathVariable UUID taskId) {
        taskService.deleteTask(id, taskId, SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Task deleted", null));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<ApiResponse<TaskDto>> updateStatus(@PathVariable UUID id, @PathVariable UUID taskId,
                                                             @Valid @RequestBody TaskStatusRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task status updated",
                taskService.updateStatus(id, taskId, SecurityUtil.getCurrentUserId(), request.getStatus())));
    }

    @PatchMapping("/{taskId}/assign")
    public ResponseEntity<ApiResponse<TaskDto>> assignTask(@PathVariable UUID id, @PathVariable UUID taskId,
                                                           @RequestBody AssignRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task assigned",
                taskService.assignTask(id, taskId, SecurityUtil.getCurrentUserId(), request.assigneeId())));
    }

    public record AssignRequest(@jakarta.validation.constraints.NotNull UUID assigneeId) {}
}
