package com.ppmp.shared.util;

import com.ppmp.shared.enums.FileType;

import java.util.Arrays;
import java.util.List;

public final class FileUtil {

    private static final List<String> IMAGE_EXTENSIONS = List.of("jpg", "jpeg", "png", "gif", "webp", "svg", "bmp");
    private static final List<String> DOCUMENT_EXTENSIONS = List.of("pdf", "doc", "docx", "txt", "md", "xls", "xlsx", "ppt", "pptx");
    private static final List<String> VIDEO_EXTENSIONS = List.of("mp4", "mov", "avi", "mkv", "webm");

    private FileUtil() {}

    public static String getExtension(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return "";
        }
        int lastDot = fileName.lastIndexOf('.');
        return lastDot >= 0 ? fileName.substring(lastDot + 1).toLowerCase() : "";
    }

    public static FileType detectFileType(String fileName) {
        String ext = getExtension(fileName);
        if (IMAGE_EXTENSIONS.contains(ext)) return FileType.IMAGE;
        if (DOCUMENT_EXTENSIONS.contains(ext)) return FileType.DOCUMENT;
        if (VIDEO_EXTENSIONS.contains(ext)) return FileType.VIDEO;
        return FileType.OTHER;
    }

    public static boolean isAllowedExtension(String fileName) {
        String ext = getExtension(fileName);
        return Arrays.asList("jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "pdf", "doc", "docx",
                "txt", "md", "xls", "xlsx", "ppt", "pptx", "mp4", "mov", "avi", "mkv", "webm").contains(ext);
    }

    public static String formatSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.1f KB", bytes / 1024.0);
        if (bytes < 1024 * 1024 * 1024) return String.format("%.1f MB", bytes / (1024.0 * 1024));
        return String.format("%.1f GB", bytes / (1024.0 * 1024 * 1024));
    }
}
