package com.ppmp.modules.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectStatsDto {
    private long total;
    private Map<String, Long> byStatus;
    private Map<String, Long> byVisibility;
    private List<DailyCountDto> byDay;
}
