package com.ppmp.modules.portfolio.entity;

import com.ppmp.modules.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "portfolio_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 255)
    private String headline;

    @Column(name = "about_text", columnDefinition = "TEXT")
    private String aboutText;

    @Column(length = 50)
    @Builder.Default
    private String theme = "default";

    @Column(name = "show_github_stats", nullable = false)
    @Builder.Default
    private Boolean showGithubStats = true;

    @Column(name = "show_contact_form", nullable = false)
    @Builder.Default
    private Boolean showContactForm = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custom_links", columnDefinition = "jsonb")
    private Map<String, String> customLinks;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
