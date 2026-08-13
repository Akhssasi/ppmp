package com.ppmp.modules.auth.service;

import com.ppmp.config.JwtConfig;
import com.ppmp.infrastructure.email.EmailService;
import com.ppmp.modules.auth.dto.*;
import com.ppmp.modules.auth.entity.RefreshToken;
import com.ppmp.modules.auth.repository.RefreshTokenRepository;
import com.ppmp.modules.auth.security.JwtTokenProvider;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.constants.AppConstants;
import com.ppmp.shared.exception.BadRequestException;
import com.ppmp.shared.exception.DuplicateResourceException;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import com.ppmp.shared.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtConfig jwtConfig;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        String baseSlug = SlugUtil.toSlug(request.getUsername());
        String slug = baseSlug;
        int counter = 1;
        while (userRepository.existsByPortfolioSlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .portfolioSlug(slug)
                .build();
        user = userRepository.save(user);

        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken, frontendUrl);
        return buildAuthResponse(user, "register");
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        if (user.isLocked()) {
            throw new BadRequestException("Account is temporarily locked due to failed login attempts. Try again later.");
        }
        if (!user.getIsActive()) {
            throw new BadRequestException("Account is disabled. Contact support.");
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));
        } catch (BadCredentialsException ex) {
            user.incrementFailedLoginAttempts();
            if (user.getFailedLoginAttempts() >= AppConstants.MAX_LOGIN_ATTEMPTS) {
                user.lock(AppConstants.LOCK_DURATION_MINUTES);
                user.resetFailedLoginAttempts();
                log.warn("User {} locked for {} minutes after repeated failures", user.getUsername(), AppConstants.LOCK_DURATION_MINUTES);
            }
            userRepository.save(user);
            throw ex;
        }

        user.resetFailedLoginAttempts();
        userRepository.save(user);
        return buildAuthResponse(user, "login");
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (stored.isExpired() || stored.getRevoked()) {
            throw new UnauthorizedException("Refresh token has expired or was revoked. Please sign in again.");
        }

        User user = stored.getUser();
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole().name());
        String newRefreshToken = UUID.randomUUID().toString();
        stored.setToken(newRefreshToken);
        stored.setCreatedDate(Instant.now());
        stored.setExpiryDate(Instant.now().plus(jwtConfig.getRefreshTokenExpirationMs(), ChronoUnit.MILLIS));
        refreshTokenRepository.save(stored);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getAccessTokenExpirationMs() / 1000)
                .user(toSummary(user))
                .build();
    }

    @Transactional
    public void logout(UUID userId, String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByToken(refreshToken).ifPresent(RefreshToken::revoke);
        } else {
            refreshTokenRepository.deleteAllForUser(userId);
        }
    }

    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("If this email exists, a reset link has been sent"));
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), token, frontendUrl);
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
        if (user.getPasswordResetTokenExpiry() == null
                || user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
    }

    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        user.setIsEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);
    }

    @Transactional
    public void resendVerification(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (Boolean.TRUE.equals(user.getIsEmailVerified())) {
            throw new BadRequestException("Email is already verified");
        }
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), token, frontendUrl);
    }

    @Transactional
    public AuthResponse oauth2Login(String provider, String providerId, String email, String name, String username) {
        User user = userRepository.findByOauthProviderAndOauthProviderId(provider, providerId)
                .orElseGet(() -> userRepository.findByEmail(email)
                        .map(existing -> {
                            existing.setOauthProvider(provider);
                            existing.setOauthProviderId(providerId);
                            return userRepository.save(existing);
                        })
                        .orElseGet(() -> {
                            String baseUsername = SlugUtil.toSlug(username != null ? username : "user");
                            String finalUsername = baseUsername;
                            int counter = 1;
                            while (userRepository.existsByUsername(finalUsername)) {
                                finalUsername = baseUsername + counter++;
                            }
                            User newUser = User.builder()
                                    .username(finalUsername)
                                    .email(email)
                                    .passwordHash(UUID.randomUUID().toString())
                                    .fullName(name != null ? name : finalUsername)
                                    .oauthProvider(provider)
                                    .oauthProviderId(providerId)
                                    .isEmailVerified(true)
                                    .build();
                            return userRepository.save(newUser);
                        }));
        if (!user.getIsActive()) {
            throw new BadRequestException("Account is disabled");
        }
        return buildAuthResponse(user, "oauth2");
    }

    private AuthResponse buildAuthResponse(User user, String action) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRole().name());
        String refreshToken = UUID.randomUUID().toString();
        RefreshToken rt = RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .createdDate(Instant.now())
                .expiryDate(Instant.now().plus(jwtConfig.getRefreshTokenExpirationMs(), ChronoUnit.MILLIS))
                .deviceInfo(action)
                .build();
        refreshTokenRepository.save(rt);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtConfig.getAccessTokenExpirationMs() / 1000)
                .user(toSummary(user))
                .build();
    }

    private AuthResponse.UserSummary toSummary(User user) {
        return AuthResponse.UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .portfolioSlug(user.getPortfolioSlug())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
