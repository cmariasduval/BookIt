package com.example.bookit.Entities;

import jakarta.persistence.*;
import org.hibernate.annotations.ManyToAny;

import com.example.bookit.Entities.Book;

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

    public BookCopy(String copyId, Book book) {
        this.copyId = copyId;
        this.book = book;
    }

    public BookCopy() {

    }

    public int getId(){
        return id;
    }

    public void setId(int id){
        this.id = id;
    }

    public String getCopyId(){
        return copyId;
    }

    public void setCopyId(String copyId){
        this.copyId = copyId;
    }
    public Book getBook(){
        return book;
    }

    public void setBook(Book book){
        this.book = book;
    }



}
