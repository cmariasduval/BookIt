package com.example.bookit.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "copy_id", nullable = false)
    private BookCopy copy;

    @Column(name = "pickup_date", nullable = false)
    private LocalDate pickupDate;

    @Column(name = "return_date", nullable = false)
    private LocalDate returnDate;

    @Column(name = "period", nullable = false)
    private int period;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status;



    // Constructor vacío
    public Reservation() {
    }

    // Constructor con parámetros
    public Reservation(User user, BookCopy copy, LocalDate reservationDate, LocalDate pickupDate, int period, ReservationStatus status) {
        this.user = user;
        this.copy = copy;
        this.pickupDate = reservationDate;
        this.pickupDate = pickupDate;
        this.period = period;
        this.status = status;
    }

    // Getters y Setters
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

    public BookCopy getCopy() {
        return copy;
    }

    public void setCopy(BookCopy copy) {
        this.copy = copy;
    }

    public LocalDate getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(LocalDate pickupDate) {
        this.pickupDate = pickupDate;
    }

    public LocalDate getReturnDate(){
        return returnDate;
    }
    public void setReturnDate(LocalDate returnDate){
        this.returnDate = returnDate;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }


    public Book getBook() {
        return copy.getBook();
    }


}