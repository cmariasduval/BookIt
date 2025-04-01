package com.example.bookit.entities;

import jakarta.persistence.*;

public class genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String genreType;

    public genre(String genreType) {
        this.genreType = genreType;

    }

    public String getGenreType() {
        return genreType;
    }

    public void setGenreType(String genreType) {
        this.genreType = genreType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


}
