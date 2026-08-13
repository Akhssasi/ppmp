package com.ppmp.modules.file.service;

import com.ppmp.infrastructure.storage.StorageService;
import com.ppmp.modules.file.dto.FileDto;
import com.ppmp.modules.file.entity.ProjectFile;
import com.ppmp.modules.file.repository.ProjectFileRepository;
import com.ppmp.modules.project.entity.Project;
import com.ppmp.modules.project.service.ProjectService;
import com.ppmp.modules.user.entity.User;
import com.ppmp.modules.user.repository.UserRepository;
import com.ppmp.shared.exception.BadRequestException;
import com.ppmp.shared.exception.ResourceNotFoundException;
import com.ppmp.shared.exception.UnauthorizedException;
import com.ppmp.shared.util.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final ProjectFileRepository fileRepository;
    private final ProjectService projectService;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional
    public FileDto upload(UUID projectId, UUID userId, MultipartFile file) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to upload files to this project");
        }
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (!FileUtil.isAllowedExtension(file.getOriginalFilename())) {
            throw new BadRequestException("File type not allowed");
        }
        if (file.getSize() > 10L * 1024 * 1024) {
            throw new BadRequestException("File size must be under 10MB");
        }
        User uploader = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String url;
        try {
            url = storageService.upload(file, "projects/" + projectId);
        } catch (IOException ex) {
            throw new BadRequestException("Failed to upload file: " + ex.getMessage());
        }

        ProjectFile entity = ProjectFile.builder()
                .project(project)
                .uploader(uploader)
                .fileName(file.getOriginalFilename())
                .fileUrl(url)
                .fileType(FileUtil.detectFileType(file.getOriginalFilename()))
                .fileSize(file.getSize())
                .build();
        return toDto(fileRepository.save(entity));
    }

    @Transactional(readOnly = true)
    public List<FileDto> getFiles(UUID projectId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canAccess(project, userId)) {
            throw new UnauthorizedException("You do not have access to this project");
        }
        return fileRepository.findByProjectIdOrderByUploadedAtDesc(projectId).stream().map(this::toDto).toList();
    }

    @Transactional
    public void delete(UUID projectId, UUID fileId, UUID userId) {
        Project project = projectService.getProjectEntity(projectId);
        if (!projectService.canEdit(project, userId)) {
            throw new UnauthorizedException("You do not have permission to delete files from this project");
        }
        ProjectFile file = fileRepository.findByIdAndProjectId(fileId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found"));
        storageService.delete(storageService.extractKeyFromUrl(file.getFileUrl()));
        fileRepository.delete(file);
    }

    private FileDto toDto(ProjectFile file) {
        return FileDto.builder()
                .id(file.getId())
                .projectId(file.getProject().getId())
                .uploaderId(file.getUploader().getId())
                .fileName(file.getFileName())
                .fileUrl(file.getFileUrl())
                .fileType(file.getFileType())
                .fileSize(file.getFileSize())
                .uploadedAt(file.getUploadedAt())
                .build();
    }
}
