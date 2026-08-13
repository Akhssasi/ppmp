package com.ppmp.modules.file.dto;

import com.ppmp.shared.enums.FileType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {
    private UUID id;
    private UUID projectId;
    private UUID uploaderId;
    private String fileName;
    private String fileUrl;
    private FileType fileType;
    private Long fileSize;
    private LocalDateTime uploadedAt;
}
