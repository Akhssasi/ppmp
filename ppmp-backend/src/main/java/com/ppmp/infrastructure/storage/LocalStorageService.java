package com.ppmp.infrastructure.storage;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Slf4j
@Service
@ConditionalOnProperty(name = "app.storage.provider", havingValue = "local", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private final Path baseDir;

    public LocalStorageService(@Value("${app.storage.local-dir:./uploads}") String localDir) {
        this.baseDir = Paths.get(localDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.baseDir);
        } catch (IOException ex) {
            throw new IllegalStateException("Cannot create storage directory", ex);
        }
    }

    @Override
    public String upload(MultipartFile file, String folder) throws IOException {
        Path dir = baseDir.resolve(folder);
        Files.createDirectories(dir);
        String fileName = UUID.randomUUID() + "-" + sanitize(file.getOriginalFilename());
        Path target = dir.resolve(fileName);
        file.transferTo(target.toAbsolutePath());
        return "/ppmp/" + folder + "/" + fileName;
    }

    @Override
    public InputStream download(String key) throws IOException {
        Path resolved = baseDir.resolve(key).normalize();
        if (!resolved.startsWith(baseDir)) {
            throw new IOException("Invalid storage key");
        }
        return Files.newInputStream(resolved);
    }

    @Override
    public void delete(String key) {
        try {
            Path resolved = baseDir.resolve(key).normalize();
            if (resolved.startsWith(baseDir)) {
                Files.deleteIfExists(resolved);
            }
        } catch (IOException ex) {
            log.warn("Failed to delete local file {}: {}", key, ex.getMessage());
        }
    }

    private String sanitize(String name) {
        if (name == null) return "file";
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
