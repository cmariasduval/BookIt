// BatchUploadResponse.java
package com.example.bookit.DTO;

import java.util.List;

public class BatchUploadResponse {
    private boolean success;
    private String message;
    private int successfulUploads;
    private int totalBooks;
    private List<String> errors;

    // Constructor por defecto
    public BatchUploadResponse() {}

    // Constructor con parámetros
    public BatchUploadResponse(boolean success, String message, int successfulUploads,
                               int totalBooks, List<String> errors) {
        this.success = success;
        this.message = message;
        this.successfulUploads = successfulUploads;
        this.totalBooks = totalBooks;
        this.errors = errors;
    }

    // Getters y Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getSuccessfulUploads() {
        return successfulUploads;
    }

    public void setSuccessfulUploads(int successfulUploads) {
        this.successfulUploads = successfulUploads;
    }

    public int getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(int totalBooks) {
        this.totalBooks = totalBooks;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    @Override
    public String toString() {
        return "BatchUploadResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", successfulUploads=" + successfulUploads +
                ", totalBooks=" + totalBooks +
                ", errors=" + errors +
                '}';
    }
}