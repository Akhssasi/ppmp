package com.ppmp.modules.task.dto;

import com.ppmp.shared.enums.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    @NotBlank(message = "Task title is required")
    @Size(max = 200)
    private String title;

    private String description;

    private TaskPriority priority;

    private LocalDate dueDate;

    private UUID assignedToId;
}
