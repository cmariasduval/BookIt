package com.example.bookit.DTO;

public class UserInfractionDTO {
    private Long id;
    private String username;
    private String email;
    private double debt;          // deuda por infracciones
    private int infractionCount;  // cantidad de infracciones

    public UserInfractionDTO(Long id, String username, String email, double debt, int infractionCount) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.debt = debt;
        this.infractionCount = infractionCount;
    }

    // getters y setters

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
}
