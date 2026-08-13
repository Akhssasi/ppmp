package com.ppmp.infrastructure.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

public interface StorageService {

    String upload(MultipartFile file, String folder) throws IOException;

    InputStream download(String key) throws IOException;

    void delete(String key);

    default String extractKeyFromUrl(String url) {
        if (url == null || url.isBlank()) return null;
        int idx = url.indexOf("/ppmp/");
        if (idx >= 0) return url.substring(idx + 1);
        idx = url.lastIndexOf('/');
        return url.substring(idx + 1);
    }
}
