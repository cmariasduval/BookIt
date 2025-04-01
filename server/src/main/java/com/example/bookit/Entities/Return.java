package com.example.bookit.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class Return {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "id", nullable = false)
    private int id;

    @OneToOne
    @JoinColumn(name = "reservation_ID", nullable = false)
    private Reservation reservationID;

    @Column(name = "return_ID", nullable = false)
    private LocalDate returnID;

    public Return() {}

    public Return(int id, Reservation reservationID, LocalDate returnID) {
        this.id = id;
        this.reservationID = reservationID;
        this.returnID = returnID;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Reservation getReservationID() {
        return reservationID;
    }

    public void setReservationID(Reservation reservationID) {
        this.reservationID = reservationID;
    }

    public LocalDate getReturnID() {
        return returnID;
    }

    public void setReturnID(LocalDate returnID) {
        this.returnID = returnID;
    }


}
