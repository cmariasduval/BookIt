package com.example.bookit.Entities;

import jakarta.persistence.*;

@Entity
public class MonthlyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id", nullable = false)
    private int id;



    @ManyToOne
    @JoinColumn(name = "User_ID")
    private User user;

    @Column
    private int bookCount;

    @Column(name = "month", nullable = false)
    private int month;

    @Column(name = "year", nullable = false)
    private int year;

    public MonthlyGoal() {}

    public MonthlyGoal(int bookCount, int month, int year) {

        this.bookCount = bookCount;
        this.month = month;
        this.year = year;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }



    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getBookCount() {
        return bookCount;
    }

    public void setBookCount(int bookCount) {
        this.bookCount = bookCount;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }
}
