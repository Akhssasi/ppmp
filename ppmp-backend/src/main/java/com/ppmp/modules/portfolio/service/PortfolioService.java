package com.ppmp.modules.portfolio.service;

import com.ppmp.infrastructure.pdf.PdfGeneratorService;
import com.ppmp.modules.portfolio.dto.PortfolioSettingsDto;
import com.ppmp.modules.portfolio.dto.PortfolioSettingsRequest;
import com.ppmp.modules.portfolio.dto.PublicPortfolioDto;
import com.ppmp.modules.portfolio.entity.PortfolioSettings;
import com.ppmp.modules.portfolio.repository.PortfolioSettingsRepository;
import com.ppmp.modules.project.dto.ProjectListDto;
import com.ppmp.modules.project.repository.ProjectRepository;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.modules.user.dto.PublicUserDto;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.modules.user.service.UserService;
import com.ppmp.shared.enums.ProjectStatus;
import com.ppmp.shared.enums.ProjectVisibility;
import com.ppmp.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioSettingsRepository settingsRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final PdfGeneratorService pdfGeneratorService;

    @Transactional(readOnly = true)
    public PortfolioSettingsDto getMyPortfolio(UUID userId) {
        return toDto(getOrCreateSettings(userId));
    }

    @Transactional
    public PortfolioSettingsDto updateSettings(UUID userId, PortfolioSettingsRequest request) {
        PortfolioSettings settings = getOrCreateSettings(userId);
        if (request.getHeadline() != null) settings.setHeadline(request.getHeadline());
        if (request.getAboutText() != null) settings.setAboutText(request.getAboutText());
        if (request.getTheme() != null) settings.setTheme(request.getTheme());
        if (request.getShowGithubStats() != null) settings.setShowGithubStats(request.getShowGithubStats());
        if (request.getShowContactForm() != null) settings.setShowContactForm(request.getShowContactForm());
        if (request.getCustomLinks() != null) settings.setCustomLinks(request.getCustomLinks());
        return toDto(settingsRepository.save(settings));
    }

    @Transactional(readOnly = true)
    public PublicPortfolioDto getPublicPortfolio(String slug) {
        User user = userRepository.findByPortfolioSlug(slug)
                .or(() -> userRepository.findByUsername(slug))
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio not found"));
        if (!user.getIsActive()) {
            throw new ResourceNotFoundException("Portfolio not found");
        }
        PortfolioSettings settings = settingsRepository.findByUserId(user.getId()).orElse(null);
        List<ProjectListDto> projects = projectRepository
                .findByOwnerIdAndVisibilityOrderByUpdatedAtDesc(user.getId(), ProjectVisibility.PUBLIC)
                .stream().map(projectService::toListDto).toList();

        List<String> topTechnologies = projectRepository.countTechnologiesUsage(user.getId())
                .stream().limit(8).map(row -> (String) row[0]).toList();

        return PublicPortfolioDto.builder()
                .user(PublicUserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .bio(user.getBio())
                        .avatarUrl(user.getAvatarUrl())
                        .portfolioSlug(user.getPortfolioSlug())
                        .build())
                .settings(settings != null ? toDto(settings) : null)
                .projects(projects)
                .totalProjects(projects.size())
                .completedProjects(projectRepository.findByOwnerIdAndStatus(
                        user.getId(), ProjectStatus.COMPLETED,
                        org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements())
                .inProgressProjects(projectRepository.findByOwnerIdAndStatus(
                        user.getId(), ProjectStatus.IN_PROGRESS,
                        org.springframework.data.domain.PageRequest.of(0, 1)).getTotalElements())
                .topTechnologies(topTechnologies)
                .build();
    }

    @Transactional(readOnly = true)
    public byte[] exportPortfolioPdf(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        PublicPortfolioDto portfolio = getPublicPortfolio(user.getPortfolioSlug());
        try {
            return pdfGeneratorService.generatePortfolioPdf(portfolio);
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate PDF", ex);
        }
    }

    @Transactional
    public PortfolioSettings getOrCreateSettings(UUID userId) {
        return settingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    return settingsRepository.save(PortfolioSettings.builder().user(user).build());
                });
    }

    private PortfolioSettingsDto toDto(PortfolioSettings settings) {
        return PortfolioSettingsDto.builder()
                .id(settings.getId())
                .userId(settings.getUser().getId())
                .headline(settings.getHeadline())
                .aboutText(settings.getAboutText())
                .theme(settings.getTheme())
                .showGithubStats(settings.getShowGithubStats())
                .showContactForm(settings.getShowContactForm())
                .customLinks(settings.getCustomLinks() != null ? settings.getCustomLinks() : Map.of())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
