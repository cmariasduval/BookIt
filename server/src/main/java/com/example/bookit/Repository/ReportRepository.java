package com.example.bookit.Repository;

import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.Report;
import com.example.bookit.Entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.pickupDate BETWEEN :startDate AND :endDate")
    List<Reservation> findReservationsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT r FROM Reservation r WHERE r.returnDate BETWEEN :startDate AND :endDate AND r.status = com.example.bookit.Entities.ReservationStatus.ACTIVE")
    List<Reservation> findReturnsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT i FROM Infraction i WHERE i.date BETWEEN :startDate AND :endDate")
    List<Infraction> findInfractionsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}

