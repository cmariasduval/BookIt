package com.example.bookit.DTO;

public class ReservationRequest {

    public Long copyId;
    public String pickupDate;
    public int period;

    public ReservationRequest() {}  // Constructor por defecto para deserialización

    public ReservationRequest(Long copyId, String reservationDate, int period) {
        this.copyId = copyId;
        this.pickupDate = reservationDate;
        this.period = period;
    }


    public Long getCopyId() {
        return copyId;
    }

    public void setCopyId(Long copyId) {
        this.copyId = copyId;
    }

    public String getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(String pickupDate) {
        this.pickupDate = pickupDate;
    }

    public int getPeriod() {
        return period;
    }

    public void setPeriod(int period) {
        this.period = period;
    }
}
