package com.example.bookit.DTO;

import java.time.LocalDate;

import java.time.LocalDate;

public class UserProfileData {
    private Integer id;
    private String username;
    private String email;
    private double debt;
    private int infractionCount;
    private boolean blocked;
    private LocalDate blockedUntil;

    public UserProfileData() {}

    public UserProfileData(Integer id, String username, String email, double debt,
                          int infractionCount, boolean blocked, LocalDate blockedUntil) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.debt = debt;
        this.infractionCount = infractionCount;
        this.blocked = blocked;
        this.blockedUntil = blockedUntil;
    }

    // Getters y setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getDebt() {
        return debt;
    }

    public void setDebt(double debt) {
        this.debt = debt;
    }

    public int getInfractionCount() {
        return infractionCount;
    }

    public void setInfractionCount(int infractionCount) {
        this.infractionCount = infractionCount;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public LocalDate getBlockedUntil() {
        return blockedUntil;
    }

    public void setBlockedUntil(LocalDate blockedUntil) {
        this.blockedUntil = blockedUntil;
    }
}