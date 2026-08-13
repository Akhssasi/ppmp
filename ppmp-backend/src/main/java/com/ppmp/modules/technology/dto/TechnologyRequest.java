package com.ppmp.modules.technology.dto;

import com.ppmp.shared.enums.TechnologyCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyRequest {

    @NotBlank(message = "Technology name is required")
    @Size(max = 100)
    private String name;

    private TechnologyCategory category;

    private String iconUrl;
}
