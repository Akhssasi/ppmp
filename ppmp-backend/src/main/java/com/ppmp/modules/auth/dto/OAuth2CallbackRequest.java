package com.ppmp.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2CallbackRequest {

    @NotBlank(message = "Provider id is required")
    private String providerId;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

    private String name;

    private String username;
}
