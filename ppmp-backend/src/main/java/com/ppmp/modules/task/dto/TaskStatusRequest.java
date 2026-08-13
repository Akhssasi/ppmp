package com.ppmp.modules.task.dto;

import com.ppmp.shared.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskStatusRequest {

    @NotNull(message = "Status is required")
    private TaskStatus status;
}
