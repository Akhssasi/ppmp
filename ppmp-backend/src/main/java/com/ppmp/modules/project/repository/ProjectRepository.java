package com.ppmp.modules.project.repository;

import com.ppmp.modules.project.entity.Project;
import com.ppmp.shared.enums.ProjectStatus;
import com.ppmp.shared.enums.ProjectVisibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Page<Project> findByOwnerId(UUID ownerId, Pageable pageable);

    Page<Project> findByOwnerIdAndStatus(UUID ownerId, ProjectStatus status, Pageable pageable);

    Page<Project> findByOwnerIdAndVisibility(UUID ownerId, ProjectVisibility visibility, Pageable pageable);

    List<Project> findByOwnerIdAndVisibilityOrderByUpdatedAtDesc(UUID ownerId, ProjectVisibility visibility);

    @Query("SELECT p FROM Project p JOIN p.technologies t WHERE p.owner.id = :ownerId AND t.id = :techId")
    Page<Project> findByOwnerAndTechnology(@Param("ownerId") UUID ownerId, @Param("techId") UUID techId, Pageable pageable);

    List<Project> findByVisibilityAndIsFeaturedTrue(ProjectVisibility visibility);

    List<Project> findByVisibilityOrderByUpdatedAtDesc(ProjectVisibility visibility, Pageable pageable);

    @Query("SELECT p FROM Project p JOIN p.technologies t WHERE p.visibility = com.ppmp.shared.enums.ProjectVisibility.PUBLIC " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(p.shortDescription) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(t.name) LIKE LOWER(CONCAT('%', :q, '%'))) GROUP BY p.id")
    Page<Project> searchPublic(@Param("q") String q, Pageable pageable);

    @Query("SELECT p FROM Project p JOIN p.technologies t WHERE p.visibility = com.ppmp.shared.enums.ProjectVisibility.PUBLIC " +
           "AND t.id = :techId")
    List<Project> findPublicByTechnology(@Param("techId") UUID techId);

    @Query("SELECT p.status, COUNT(p) FROM Project p WHERE p.owner.id = :ownerId GROUP BY p.status")
    List<Object[]> countByStatus(@Param("ownerId") UUID ownerId);

    @Query("SELECT p.visibility, COUNT(p) FROM Project p WHERE p.owner.id = :ownerId GROUP BY p.visibility")
    List<Object[]> countByVisibility(@Param("ownerId") UUID ownerId);

    @Query("SELECT t.name, COUNT(p) FROM Project p JOIN p.technologies t WHERE p.owner.id = :ownerId GROUP BY t.name ORDER BY COUNT(p) DESC")
    List<Object[]> countTechnologiesUsage(@Param("ownerId") UUID ownerId);

    @Query("SELECT COUNT(p) FROM Project p")
    long countTotal();

    @Query("SELECT p.status, COUNT(p) FROM Project p GROUP BY p.status")
    List<Object[]> countAllByStatus();

    @Query("SELECT p.visibility, COUNT(p) FROM Project p GROUP BY p.visibility")
    List<Object[]> countAllByVisibility();

    @Query("SELECT DATE(p.createdAt) AS d, COUNT(p) FROM Project p GROUP BY DATE(p.createdAt) ORDER BY d")
    List<Object[]> countCreatedByDay();

    Optional<Project> findByIdAndOwnerId(UUID id, UUID ownerId);

    long countByOwnerId(UUID ownerId);

    long countByCreatedAtAfter(java.time.LocalDateTime after);
}
