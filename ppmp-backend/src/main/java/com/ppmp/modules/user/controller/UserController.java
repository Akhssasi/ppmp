package com.ppmp.modules.user.controller;

import com.ppmp.modules.user.dto.ChangePasswordRequest;
import com.ppmp.modules.user.dto.PublicUserDto;
import com.ppmp.modules.user.dto.UpdateProfileRequest;
import com.ppmp.modules.user.dto.UserDto;
import com.ppmp.modules.user.service.UserService;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getMe() {
        return ResponseEntity.ok(ApiResponse.ok("Current user", userService.getCurrentUser(SecurityUtil.getCurrentUserId())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Profile updated", userService.updateProfile(SecurityUtil.getCurrentUserId(), request)));
    }

    @PutMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<UserDto>> updateAvatar(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.ok("Avatar updated", userService.updateAvatar(SecurityUtil.getCurrentUserId(), file)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(SecurityUtil.getCurrentUserId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Password changed successfully", null));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount() {
        userService.deleteAccount(SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("Account deleted", null));
    }

    @GetMapping("/{username}/public")
    public ResponseEntity<ApiResponse<PublicUserDto>> getPublicUser(@PathVariable String username) {
        return ResponseEntity.ok(ApiResponse.ok("Public user", userService.getPublicUser(username)));
    }
}
