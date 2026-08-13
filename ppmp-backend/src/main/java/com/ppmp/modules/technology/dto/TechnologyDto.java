package com.ppmp.modules.technology.dto;

import com.ppmp.shared.enums.TechnologyCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyDto {
    private UUID id;
    private String name;
    private TechnologyCategory category;
    private String iconUrl;
}
