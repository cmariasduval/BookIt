package com.example.bookit.Entities;

import jakarta.persistence.*;

@Entity
public class BookCopy {

    @Id
    @GeneratedValue
    @Column(name = "ID", nullable = false)
    private int id;

    @Column(name = "Copy ID", nullable = false)
    private String copyId;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "Available", nullable = false)
    private boolean available;

    public BookCopy(Book book, String copyId, boolean available) {
        this.book = book;
        this.copyId = copyId;
        this.available = available;
    }

    public BookCopy() {
    }

    // Getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCopyId() {
        return copyId;
    }

    public void setCopyId(String copyId) {
        this.copyId = copyId;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
