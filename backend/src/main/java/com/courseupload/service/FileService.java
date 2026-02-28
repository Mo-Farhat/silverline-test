package com.courseupload.service;

import com.courseupload.exception.InvalidFileException;
import com.courseupload.exception.ResourceNotFoundException;
import com.courseupload.model.FileMetadata;
import com.courseupload.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

@Service
public class FileService {

    private final FileMetadataRepository fileRepository;
    private final Path fileStorageLocation;
    
    // As per PRD
    private static final List<String> ALLOWED_MIME_TYPES = Arrays.asList(
            "application/pdf", "video/mp4", "image/jpeg", "image/png"
    );
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    public FileService(FileMetadataRepository fileRepository, @Value("${file.upload-dir}") String uploadDir) {
        this.fileRepository = fileRepository;
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileMetadata storeFile(MultipartFile file) {
        validateFile(file);

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Copy file to the target location (Replacing existing file with the same name)
            // Using a unique timestamp prefix to avoid name collisions in the filesystem
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Save metadata to database
            FileMetadata metadata = new FileMetadata(
                    fileName,
                    file.getContentType(),
                    file.getSize(),
                    targetLocation.toString()
            );

            return fileRepository.save(metadata);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public List<FileMetadata> getAllFiles() {
        return fileRepository.findAll();
    }

    public FileMetadata getFileMetadata(Long id) {
        return fileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id " + id));
    }
    
    public org.springframework.core.io.Resource loadFileAsResource(Long id) {
       FileMetadata metadata = getFileMetadata(id);
       try {
           Path filePath = Paths.get(metadata.getFileUrl()).normalize();
           org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(filePath.toUri());
           if(resource.exists()) {
               return resource;
           } else {
               throw new ResourceNotFoundException("File not found " + metadata.getFileName());
           }
       } catch (Exception ex) {
           throw new ResourceNotFoundException("File not found " + metadata.getFileName());
       }
    }

    public void deleteFile(Long id) {
        FileMetadata metadata = getFileMetadata(id);
        try {
            Path filePath = Paths.get(metadata.getFileUrl()).normalize();
            Files.deleteIfExists(filePath);
            fileRepository.delete(metadata);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file " + metadata.getFileName(), ex);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Cannot upload empty file");
        }

        if (!ALLOWED_MIME_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Invalid file type. Allowed: PDF, MP4, JPG, PNG");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
             throw new InvalidFileException("File size exceeds 50MB limit");
        }
    }
}
