package com.ppmp.modules.search.dto;

import com.ppmp.modules.project.dto.ProjectListDto;
import com.ppmp.modules.user.dto.PublicUserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private List<ProjectListDto> projects;
    private List<PublicUserDto> portfolios;
}
