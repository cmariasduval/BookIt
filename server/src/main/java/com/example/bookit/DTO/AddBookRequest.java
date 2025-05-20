package com.example.bookit.DTO;

import com.example.bookit.Entities.Genre;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class AddBookRequest {

    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private String description;
    private String keywords;
    private int copies;
    private String imageUrl;
    private List<String> genres;

    public AddBookRequest() {
    }

    public AddBookRequest(String isbn, String title, String author, String publisher,
                          String description, String keywords, int copies, String imageUrl, List<String> genres) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.description = description;
        this.keywords = keywords;
        this.copies = copies;
        this.imageUrl = imageUrl;
        this.genres = genres;
    }

    // Getters and Setters
    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

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

    public int getCopies() {
        return copies;
    }

    public void setCopies(int copies) {
        this.copies = copies;
    }

    public String getImage() {
        return imageUrl;
    }

    public void setImage(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
}
}