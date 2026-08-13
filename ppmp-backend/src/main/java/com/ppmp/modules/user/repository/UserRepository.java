package com.ppmp.modules.user.repository;

import com.ppmp.modules.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    Optional<User> findByPortfolioSlug(String portfolioSlug);

    Optional<User> findByOauthProviderAndOauthProviderId(String provider, String providerId);

    Optional<User> findByPasswordResetToken(String token);

    Optional<User> findByEmailVerificationToken(String token);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPortfolioSlug(String slug);

    Page<User> findByIsActive(Boolean isActive, Pageable pageable);

    @Query("SELECT u FROM User u WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :q, '%'))")
    Page<User> search(@Param("q") String query, Pageable pageable);

    @Query("SELECT u.username, COUNT(p.id) FROM User u LEFT JOIN u.projects p GROUP BY u.username")
    List<Object[]> countProjectsPerUser();

    long countByIsActive(Boolean isActive);

    long countByCreatedAtAfter(LocalDateTime after);
}
