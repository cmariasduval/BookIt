package com.example.bookit.Entities;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.awt.print.Book;

public class BookCopy {

    @Id
    @GeneratedValue
    private int id;

    private String copyId;

    @ManyToOne
    @JoinColumn(name = "bood_id", nullable = false)
    private Book book;

    public BookCopy() {
        this.copyId = copyId;
    }

    public




}
