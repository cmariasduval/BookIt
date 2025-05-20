package com.example.bookit.DTO;

public class ReadingDTO {

    private final String title;
    private final long daysRemaining;
    private final String statusColor;

    public ReadingDTO(String title, long daysRemaining, String statusColor) {
        this.title = title;
        this.daysRemaining = daysRemaining;
        this.statusColor = statusColor;
    }

    public String getTitle() {
        return title;
    }

    public long getDaysRemaining() {
        return daysRemaining;
    }

    public String getStatusColor() {
        return statusColor;
    }
}
