package com.courseupload.dto;

import com.courseupload.model.FileMetadata;
import java.time.LocalDateTime;

public class FileMetadataDTO {
    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadDate;
    private String fileUrl;

    public FileMetadataDTO(FileMetadata metadata) {
        this.id = metadata.getId();
        this.fileName = metadata.getFileName();
        this.fileType = metadata.getFileType();
        this.fileSize = metadata.getFileSize();
        this.uploadDate = metadata.getUploadDate();
        this.fileUrl = metadata.getFileUrl();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
