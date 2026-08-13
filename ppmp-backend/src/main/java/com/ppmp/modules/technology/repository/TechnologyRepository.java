package com.ppmp.modules.technology.repository;

import com.ppmp.modules.technology.entity.Technology;
import com.ppmp.shared.enums.TechnologyCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TechnologyRepository extends JpaRepository<Technology, UUID> {

    Optional<Technology> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Technology> findByCategory(TechnologyCategory category);

    Page<Technology> findByNameContainingIgnoreCase(String name, Pageable pageable);

    List<Technology> findByIdIn(List<UUID> ids);

    @Query("SELECT t.name, COUNT(pt) FROM Technology t JOIN t.projects pt GROUP BY t.name ORDER BY COUNT(pt) DESC")
    List<Object[]> countAllUsage();

    @Query("SELECT COUNT(DISTINCT t.id) FROM Technology t JOIN t.projects p WHERE p.owner.id = :ownerId")
    long countDistinctForOwner(java.util.UUID ownerId);
}
