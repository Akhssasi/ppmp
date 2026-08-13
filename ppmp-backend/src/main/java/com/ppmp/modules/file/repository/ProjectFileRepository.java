package com.ppmp.modules.file.repository;

import com.ppmp.modules.file.entity.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectFileRepository extends JpaRepository<ProjectFile, UUID> {

    List<ProjectFile> findByProjectIdOrderByUploadedAtDesc(UUID projectId);

    Optional<ProjectFile> findByIdAndProjectId(UUID id, UUID projectId);

    long countByProjectId(UUID projectId);
}
