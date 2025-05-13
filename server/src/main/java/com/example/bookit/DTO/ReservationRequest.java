package com.example.bookit.DTO;

public class ReservationRequest {

    public Long copyId;
    public String reservationDate;
    public int period;

    public ReservationRequest() {}  // Constructor por defecto para deserialización

    public ReservationRequest(Long copyId, String reservationDate, int period) {
        this.copyId = copyId;
        this.reservationDate = reservationDate;
        this.period = period;
    }


    public Long getCopyId() {
        return copyId;
    }

    public void setCopyId(Long copyId) {
        this.copyId = copyId;
    }

    public String getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }
}
