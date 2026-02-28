package com.courseupload.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_type", nullable = false, length = 50)
    private String fileType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "upload_date", nullable = false, updatable = false)
    private LocalDateTime uploadDate;

    @Column(name = "file_url", nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    public FileMetadata() {
        this.uploadDate = LocalDateTime.now();
    }

    public FileMetadata(String fileName, String fileType, Long fileSize, String fileUrl) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.fileUrl = fileUrl;
        this.uploadDate = LocalDateTime.now();
    }

    // Getters
    public Long getId() { return id; }
    public String getFileName() { return fileName; }
    public String getFileType() { return fileType; }
    public Long getFileSize() { return fileSize; }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public String getFileUrl() { return fileUrl; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
}
