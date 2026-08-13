package com.ppmp.modules.auth.controller;

import com.ppmp.modules.auth.dto.*;
import com.ppmp.modules.auth.service.AuthService;
import com.ppmp.modules.user.dto.UserDto;
import com.ppmp.modules.user.service.UserService;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Registration successful. Check your email to verify.", authService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(request)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        authService.logout(SecurityUtil.getCurrentUserId(), request != null ? request.getRefreshToken() : null);
        return ResponseEntity.ok(ApiResponse.ok("Logged out successfully", null));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Token refreshed", authService.refreshToken(request.getRefreshToken())));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(ApiResponse.ok("If the email exists, a reset link has been sent", null));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully", null));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authService.verifyEmail(request.getToken());
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully", null));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification() {
        authService.resendVerification(SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Verification email sent", null));
    }

    @PostMapping("/oauth2/github")
    public ResponseEntity<ApiResponse<AuthResponse>> oauth2Github(@RequestBody OAuth2CallbackRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful",
                authService.oauth2Login("github", request.getProviderId(), request.getEmail(), request.getName(), request.getUsername())));
    }

    @PostMapping("/oauth2/google")
    public ResponseEntity<ApiResponse<AuthResponse>> oauth2Google(@RequestBody OAuth2CallbackRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful",
                authService.oauth2Login("google", request.getProviderId(), request.getEmail(), request.getName(), request.getUsername())));
    }
}
