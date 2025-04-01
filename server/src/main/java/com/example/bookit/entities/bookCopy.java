package com.example.bookit.entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.awt.print.Book;

public class bookCopy {

    @Id
    @GeneratedValue
    private int id;

    private String copyId;

    @ManyToOne
    @JoinColumn(name = "bood_id", nullable = false)
    private Book book;

    public bookCopy() {
        this.copyId = copyId;

    }
}
