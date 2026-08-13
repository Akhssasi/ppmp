package com.ppmp.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementRequest {

    @NotBlank(message = "Announcement title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Announcement message is required")
    @Size(max = 5000)
    private String message;
}
