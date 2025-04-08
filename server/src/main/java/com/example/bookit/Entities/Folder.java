package com.example.bookit.Entities;

import jakarta.persistence.*;
import com.example.bookit.Entities.User;

import java.util.List;

@Entity
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "ID", nullable = false)
    private int id;

    @Column(name = "Title", nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany(mappedBy = "folders")
    private List<SavedBook> savedBooks;


    public Folder() {
    }

    public Folder(String title, User user) {
        this.title = title;
        this.user = user;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getUser() {
        return user;
    }

    public List<SavedBook> getSavedBooks() {
        return savedBooks;
    }

    public void setSavedBooks(List<SavedBook> savedBooks) {
        this.savedBooks = savedBooks;
    }

}
