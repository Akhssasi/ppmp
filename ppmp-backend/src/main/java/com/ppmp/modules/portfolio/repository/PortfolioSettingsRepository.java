package com.ppmp.modules.portfolio.repository;

import com.ppmp.modules.portfolio.entity.PortfolioSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PortfolioSettingsRepository extends JpaRepository<PortfolioSettings, UUID> {

    Optional<PortfolioSettings> findByUserId(UUID userId);
}
