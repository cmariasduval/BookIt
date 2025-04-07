package com.example.bookit.Entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;


@Entity
public class SavedBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "savedBookID", nullable = false)
    private int savedBookID;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "rating", nullable = false)
    private int rating;

    @Column(name = "review", nullable = false)
    private String review;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToMany
    @JoinColumn(name = "folder_name", nullable = false)
    private List<Folder> folders;

    public SavedBook() {}

    public SavedBook(LocalDate startDate, LocalDate endDate, int rating, String review, User user, Book book, List<Folder> folders) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.rating = rating;
        this.review = review;
        this.user = user;
        this.book = book;
        this.folders = folders;
    }

    public int getSavedBookID() {
        return savedBookID;
    }

    public void setSavedBookID(int savedBookID) {
        this.savedBookID = savedBookID;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public List<Folder> getFolders() {
        return folders;
    }

}
