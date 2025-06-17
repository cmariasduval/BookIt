package com.example.bookit.DTO;

import com.example.bookit.Entities.Reservation;

public class ReservationDTO {
    private Long id;
    private String bookTitle;
    private String userName;
    private String pickupDate;  // formato string para frontend (yyyy-MM-dd)
    private int period;
    private String status;  // PENDIENTE, ACTIVA, COMPLETADA, etc.

    // Constructor
    public ReservationDTO(Long id, String bookTitle, String userName, String pickupDate, int period, String status) {
        this.id = id;
        this.bookTitle = bookTitle;
        this.userName = userName;
        this.pickupDate = pickupDate;
        this.period = period;
        this.status = status;
    }

    // Getters y setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getBookTitle() {
        return bookTitle;
    }
    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
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
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public static ReservationDTO fromEntity(Reservation reservation) {
        return new ReservationDTO(
                reservation.getId(),
                reservation.getCopy().getBook().getTitle(),   // título del libro
                reservation.getUser().getUsername(),              // nombre de usuario
                reservation.getPickupDate().toString(),      // fecha en formato yyyy-MM-dd
                reservation.getPeriod(),                          // período
                reservation.getStatus().name());
    }


}

