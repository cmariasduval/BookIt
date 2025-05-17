package com.example.bookit.DTO;

import com.example.bookit.Entities.Genre;

import java.time.LocalDate;
import java.util.List;

public class UserUpdateRequest {
    private String username;
    private String newPassword;
    private LocalDate birthDate;
    private List<Genre> interests;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public List<Genre> getInterests() {
        return interests;
    }

    public void setInterests(List<Genre> interests) {
        this.interests = interests;
    }
}
