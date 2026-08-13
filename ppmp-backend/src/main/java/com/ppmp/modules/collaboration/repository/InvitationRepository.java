package com.ppmp.modules.collaboration.repository;

import com.ppmp.modules.collaboration.entity.Invitation;
import com.ppmp.shared.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {

    Optional<Invitation> findByToken(String token);

    List<Invitation> findByEmailAndStatus(String email, InvitationStatus status);

    List<Invitation> findByProjectId(UUID projectId);

    boolean existsByProjectIdAndEmailAndStatus(UUID projectId, String email, InvitationStatus status);
}
