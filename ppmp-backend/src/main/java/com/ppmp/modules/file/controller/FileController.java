package com.ppmp.modules.file.controller;

import com.ppmp.modules.file.dto.FileDto;
import com.ppmp.modules.file.service.FileService;
import com.ppmp.shared.response.ApiResponse;
import com.ppmp.shared.util.SecurityUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{id}/files")
@RequiredArgsConstructor
@Tag(name = "Files")
public class FileController {

    private final FileService fileService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FileDto>> upload(@PathVariable UUID id,
                                                       @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("File uploaded",
                        fileService.upload(id, SecurityUtil.getCurrentUserId(), file)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FileDto>>> getFiles(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok("Files",
                fileService.getFiles(id, SecurityUtil.getCurrentUserId())));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id, @PathVariable UUID fileId) {
        fileService.delete(id, fileId, SecurityUtil.getCurrentUserId());
        return ResponseEntity.ok(ApiResponse.ok("File deleted", null));
    }
}
