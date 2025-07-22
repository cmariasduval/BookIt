// BookBatchDTO.java
package com.example.bookit.DTO;

import java.util.List;

public class BookBatchDTO {
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private String description;
    private String keywords;
    private String imageUrl;
    private List<String> genres;
    private Integer copies;

    // Constructor por defecto
    public BookBatchDTO() {
        this.copies = 1; // Valor por defecto
    }

    // Constructor con parámetros
    public BookBatchDTO(String title, String author, String isbn, String publisher,
                        String description, String keywords, String imageUrl,
                        List<String> genres, Integer copies) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.publisher = publisher;
        this.description = description;
        this.keywords = keywords;
        this.imageUrl = imageUrl;
        this.genres = genres;
        this.copies = copies != null ? copies : 1;
    }

    // Getters y Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
    }

    public Integer getCopies() {
        return copies;
    }

    public void setCopies(Integer copies) {
        this.copies = copies != null ? copies : 1;
    }

    @Override
    public String toString() {
        return "BookBatchDTO{" +
                "title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", isbn='" + isbn + '\'' +
                ", publisher='" + publisher + '\'' +
                ", description='" + description + '\'' +
                ", keywords='" + keywords + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", genres=" + genres +
                ", copies=" + copies +
                '}';
    }
}

