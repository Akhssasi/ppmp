package com.ppmp.modules.collaboration.repository;

import com.ppmp.modules.collaboration.entity.ProjectMember;
import com.ppmp.shared.enums.MemberRole;
import com.ppmp.shared.enums.MemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {

    List<ProjectMember> findByProjectId(UUID projectId);

    Optional<ProjectMember> findByProjectIdAndUserId(UUID projectId, UUID userId);

    boolean existsByProjectIdAndUserId(UUID projectId, UUID userId);

    long countByProjectId(UUID projectId);

    List<ProjectMember> findByUserIdAndStatus(UUID userId, MemberStatus status);

    Optional<ProjectMember> findByProjectIdAndUserIdAndStatus(UUID projectId, UUID userId, MemberStatus status);

    List<ProjectMember> findByProjectIdAndRole(UUID projectId, MemberRole role);
}
