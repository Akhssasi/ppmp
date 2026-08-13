package com.ppmp.modules.search.controller;

import com.ppmp.modules.search.dto.SearchResultDto;
import com.ppmp.modules.search.service.SearchService;
import com.ppmp.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@Tag(name = "Search")
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<SearchResultDto>> searchProjects(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String tech,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok("Search results", searchService.searchProjects(q, tech, status)));
    }

    @GetMapping("/portfolios")
    public ResponseEntity<ApiResponse<SearchResultDto>> searchPortfolios(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(ApiResponse.ok("Search results", searchService.searchProjects(q, null, null)));
    }
}
