package com.example.bookit.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Infraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private boolean withFine;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private double debt = 0;  // valor de multa, si corresponde

    @Column(name = "paid")
    private boolean paid;

    public Infraction() {}

    public Infraction(User user, boolean withFine, double debt) {
        this.user = user;
        this.withFine = withFine;
        this.date = LocalDate.now();
        this.debt = debt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isWithFine() {
        return withFine;
    }

    public void setWithFine(boolean withFine) {
        this.withFine = withFine;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getDebt() {
        return debt;
    }

    public void setDebt(double debt) {
        this.debt = debt;
    }

    public double getAmount() {
        return this.debt;
    }

    public boolean isPaid() {
        return paid;
    }

    public void setPaid(boolean paid) {
        this.paid = paid;
    }

}
