package com.example.bookit.DTO;

import java.time.LocalDate;
import java.util.List;

public class CompleteProfileRequest {
    private String email; // se usa como identificador
    private LocalDate birthdate;
    private List<String> interests;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }
}
