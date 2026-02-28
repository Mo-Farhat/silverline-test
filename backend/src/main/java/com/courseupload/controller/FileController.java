package com.courseupload.controller;

import com.courseupload.dto.FileMetadataDTO;
import com.courseupload.model.FileMetadata;
import com.courseupload.service.FileService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileMetadataDTO> uploadFile(@RequestParam("file") MultipartFile file) {
        FileMetadata metadata = fileService.storeFile(file);
        return new ResponseEntity<>(new FileMetadataDTO(metadata), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FileMetadataDTO>> getAllFiles() {
        List<FileMetadata> files = fileService.getAllFiles();
        List<FileMetadataDTO> dtos = files.stream()
                .map(FileMetadataDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileMetadataDTO> getFileMetadata(@PathVariable Long id) {
        FileMetadata metadata = fileService.getFileMetadata(id);
        return ResponseEntity.ok(new FileMetadataDTO(metadata));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Resource resource = fileService.loadFileAsResource(id);
        FileMetadata metadata = fileService.getFileMetadata(id);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(metadata.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + metadata.getFileName() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id) {
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}
