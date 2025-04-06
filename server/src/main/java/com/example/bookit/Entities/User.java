package com.example.bookit.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String fullName;
    private LocalDate birthdate;

    @ManyToMany
    @JoinTable(
            name = "user_genre",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private List<Genre> interests;

    public User(){}

    public User(String username, String password, String email, String fullName, LocalDate birthdate, List<Genre> interests) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.fullName = fullName;
        this.birthdate = birthdate;
        this.interests = interests;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDate getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(LocalDate birthdate) {
        this.birthdate = birthdate;
    }

    public List<Genre> getInterests(){
        return interests;
    }

    public void setInterests(List<Genre> interests){
        this.interests = interests;
    }

}
