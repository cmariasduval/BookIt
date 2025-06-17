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

    @Query("SELECT r FROM Reservation r WHERE r.returnDate = :today AND r.status = 'ACTIVE'")
    List<Reservation> findReservationsToHandInToday(@Param("today") LocalDate today);

    @Query("SELECT r FROM Reservation r WHERE r.returnDate < :date AND r.status = com.example.bookit.Entities.ReservationStatus.PENDING")
    List<Reservation> findLatePickups(@Param("date") LocalDate date);


    List<Reservation> findByPickupDateAndStatus(LocalDate today, ReservationStatus reservationStatus);

    @Query("SELECT r FROM Reservation r WHERE r.returnDate = :today AND r.status = 'ACTIVE'")
    List<Reservation> findByReturnDate(@Param("today") LocalDate today);


    //devuelve todas las reservas de un usuarios que esten en el estado que le pases
    @Query("SELECT r FROM Reservation r WHERE r.user.email = :email AND r.status IN :statuses")
    List<Reservation> findByUserEmailAndStatuses(@Param("email") String email, @Param("statuses") List<ReservationStatus> statuses);

    List<Reservation> findAllByReturnDateBeforeAndStatusNot(LocalDate today, ReservationStatus reservationStatus);

    @Query("SELECT r FROM Reservation r WHERE r.returnDate < :today AND r.status = com.example.bookit.Entities.ReservationStatus.ACTIVE")
    List<Reservation> findLateReturns(@Param("today") LocalDate today);
}
