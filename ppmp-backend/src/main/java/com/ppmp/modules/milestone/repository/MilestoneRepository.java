package com.ppmp.modules.milestone.repository;

import com.ppmp.modules.milestone.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {

    List<Milestone> findByProjectIdOrderByTargetDateAsc(UUID projectId);

    Optional<Milestone> findByIdAndProjectId(UUID id, UUID projectId);

    long countByProjectId(UUID projectId);

    long countByProjectIdAndIsCompletedTrue(UUID projectId);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.project.owner.id = :ownerId")
    long countByOwnerId(@Param("ownerId") UUID ownerId);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.project.owner.id = :ownerId AND m.isCompleted = TRUE")
    long countCompletedByOwnerId(@Param("ownerId") UUID ownerId);
}
