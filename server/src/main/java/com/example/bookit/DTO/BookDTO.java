package com.example.bookit.DTO;

import com.example.bookit.Entities.Genre;

import java.util.List;

public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private List<Genre> genre;
    private String image;

    public BookDTO() {
    }

    public BookDTO(Long id, String title, String author, List<Genre> genre, String image) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.image = image;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<Genre> getGenre() {
        return genre;
    }

    public void setGenre(List<Genre> genre) {
        this.genre = genre;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}

