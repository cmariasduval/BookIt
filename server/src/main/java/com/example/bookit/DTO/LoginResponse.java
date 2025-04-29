package com.example.bookit.DTO;

import com.example.bookit.Entities.Genre;
import com.example.bookit.Entities.User;

import java.util.List;

public class LoginResponse {
    private String token;
    private String email;
    private String username;
    private String birthDate;
    private List<Genre> interests;

    public LoginResponse(String token, User user) {
        this.token = token;
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.birthDate = user.getBirthDate().toString();
        this.interests = user.getInterests(); // suponiendo que ya es una lista de strings
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public List<Genre> getInterests() {
        return interests;
    }

    public void setInterests(List<Genre> interests) {
        this.interests = interests;
    }
}


