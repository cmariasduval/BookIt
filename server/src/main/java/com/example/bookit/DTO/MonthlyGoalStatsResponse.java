package com.example.bookit.DTO;

public class MonthlyGoalStatsResponse {
    private int targetBooks;
    private int booksRead;
    private int booksRemaining;
    private double progressPercentage;
    private int daysInMonth;
    private int daysRemaining;
    private double dailyPaceNeeded;
    private double currentPace;
    private String status; // "on_track", "ahead", "behind"
    private boolean isAchieved;
    private String month;
    private int year;

    public MonthlyGoalStatsResponse() {}

    public MonthlyGoalStatsResponse(int targetBooks, int booksRead, int booksRemaining,
                                    double progressPercentage, int daysInMonth, int daysRemaining,
                                    double dailyPaceNeeded, double currentPace, String status,
                                    boolean isAchieved, String month, int year) {
        this.targetBooks = targetBooks;
        this.booksRead = booksRead;
        this.booksRemaining = booksRemaining;
        this.progressPercentage = progressPercentage;
        this.daysInMonth = daysInMonth;
        this.daysRemaining = daysRemaining;
        this.dailyPaceNeeded = dailyPaceNeeded;
        this.currentPace = currentPace;
        this.status = status;
        this.isAchieved = isAchieved;
        this.month = month;
        this.year = year;
    }

    // Getters and Setters
    public int getTargetBooks() { return targetBooks; }
    public void setTargetBooks(int targetBooks) { this.targetBooks = targetBooks; }

    public int getBooksRead() { return booksRead; }
    public void setBooksRead(int booksRead) { this.booksRead = booksRead; }

    public int getBooksRemaining() { return booksRemaining; }
    public void setBooksRemaining(int booksRemaining) { this.booksRemaining = booksRemaining; }

    public double getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(double progressPercentage) { this.progressPercentage = progressPercentage; }

    public int getDaysInMonth() { return daysInMonth; }
    public void setDaysInMonth(int daysInMonth) { this.daysInMonth = daysInMonth; }

    public int getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; }

    public double getDailyPaceNeeded() { return dailyPaceNeeded; }
    public void setDailyPaceNeeded(double dailyPaceNeeded) { this.dailyPaceNeeded = dailyPaceNeeded; }

    public double getCurrentPace() { return currentPace; }
    public void setCurrentPace(double currentPace) { this.currentPace = currentPace; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAchieved() { return isAchieved; }
    public void setAchieved(boolean achieved) { isAchieved = achieved; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public int getYear() { return year; }
    public void setYear(int year) { this.year = year; }
}
