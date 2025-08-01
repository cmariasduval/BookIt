package com.example.bookit.DTO;

public class MonthlyGoalRequest {
    private String name;
    private int bookCount;
    private int month;
    private int year;
    private int booksRead;

    public MonthlyGoalRequest(String name, int bookCount, int month, int year, int booksRead) {
        this.name = name;
        this.bookCount = bookCount;
        this.month = month;
        this.year = year;
        this.booksRead = booksRead;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
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

    public int getBooksRead() {
        return booksRead;
    }
}
