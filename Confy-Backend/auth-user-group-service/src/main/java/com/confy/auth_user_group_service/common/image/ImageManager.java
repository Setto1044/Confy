package com.confy.auth_user_group_service.common.image;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class ImageManager {

    // example) file.upload.directory=/home/ubuntu/app/images/
    // example) file.upload.directory=C:/images/
    @Value("${file.upload.directory}")
    private String profileUploadDir;

    public String saveImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            log.error(">> 저장 실패: 빈 이미지 파일");
            throw new IllegalArgumentException("Tried to save Empty File");
        }

        // 고유한 파일명 생성
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID() + extension;

        // 저장 경로 설정
        Path savePath = Paths.get(profileUploadDir, uniqueFilename);
        File directory = new File(profileUploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리가 없으면 생성
        }

        // 파일 저장
        Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);
        log.info("Image saved : {}", savePath);

        // 저장된 이미지의 URL 반환
        return uniqueFilename;
    }

    public void deleteImage(String filename) {
        if (filename == null || filename.isEmpty()) {
            return;
        }

        Path filePath = Paths.get(profileUploadDir, filename);
        File file = filePath.toFile();

        if (file.exists() && file.isFile()) {
            if (file.delete()) {
                log.info("Deleted previous profile image: {}", filePath);
            } else {
                log.error("Failed to delete profile image: {}", filePath);
            }
        } else {
            log.warn("Profile image does not exist: {}", filePath);
        }
    }
}
