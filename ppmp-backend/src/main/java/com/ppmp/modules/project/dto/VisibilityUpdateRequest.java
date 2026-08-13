package com.ppmp.modules.project.dto;

import com.ppmp.shared.enums.ProjectVisibility;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VisibilityUpdateRequest {

    @NotNull(message = "Visibility is required")
    private ProjectVisibility visibility;
}
