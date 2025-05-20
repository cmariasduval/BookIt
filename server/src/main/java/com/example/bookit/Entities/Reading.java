package com.example.bookit.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.temporal.Temporal;

@Entity
public class Reading {

    @Id
    @GeneratedValue
    private int id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "book_copy_id")
    private BookCopy bookCopy;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "returned", nullable = false)
    private boolean returned;

    // Constructor vacío
    public Reading() {}

    // Constructor con parámetros
    public Reading(BookCopy bookCopy, User user, LocalDate startDate) {
        this.bookCopy = bookCopy;
        this.user = user;
        this.startDate = startDate;
        this.returned = false;
    }

    // Getters y setters
    public boolean isReturned() {
        return returned;
    }

    // El administrador puede marcarlo como "devuelto"
    public void setReturned(boolean returned) {
        if (returned) {
            this.endDate = LocalDate.now(); // Marca la fecha de retorno
            this.bookCopy.setAvailable(true); // Marca el libro como disponible
        }
        this.returned = returned;
    }

    public void returnBook() {
        setReturned(true);
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public BookCopy getCopy() {
        return bookCopy;
    }

    public User getUser() {
        return user;
    }

    public String getBookTitle() {
        return bookCopy.getBook().getTitle();
    }
}
