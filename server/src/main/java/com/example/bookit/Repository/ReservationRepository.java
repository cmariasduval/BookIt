package com.example.bookit.Repository;


import com.example.bookit.DTO.ReservationRequest;
import com.example.bookit.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserAndStatus(User user, ReservationStatus status);
    List<Reservation> findByCopy(BookCopy copy);

    Optional<Reservation> findFirstByCopyAndStatusIn(BookCopy copy, List<ReservationStatus> pending);

    List<Reservation> findByUser(User user);

    List<ReservationRequest> findReservedBooksByUser(User user);

    List<Reservation> findByUserUsername(String authenticatedUser);

    @Query("SELECT r FROM Reservation r WHERE r.pickupDate = :today AND r.status = 'ACTIVE'")
    List<Reservation> findReservationsToHandInToday(@Param("today") LocalDate today);
}
