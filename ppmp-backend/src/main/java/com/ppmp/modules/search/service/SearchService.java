package com.ppmp.modules.search.service;

import com.ppmp.modules.project.repository.ProjectRepository;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.modules.search.dto.SearchResultDto;
import com.ppmp.modules.user.dto.PublicUserDto;
import com.ppmp.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    @Transactional(readOnly = true)
    public SearchResultDto searchProjects(String q, String tech, String status) {
        var projects = projectRepository.searchPublic(q == null ? "" : q, PageRequest.of(0, 50))
                .getContent().stream().map(projectService::toListDto).toList();
        var portfolios = userRepository.search(q == null ? "" : q, PageRequest.of(0, 10))
                .getContent().stream()
                .filter(u -> u.getIsActive())
                .map(u -> PublicUserDto.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .fullName(u.getFullName())
                        .bio(u.getBio())
                        .avatarUrl(u.getAvatarUrl())
                        .portfolioSlug(u.getPortfolioSlug())
                        .build())
                .toList();
        return SearchResultDto.builder().projects(projects).portfolios(portfolios).build();
    }
}
