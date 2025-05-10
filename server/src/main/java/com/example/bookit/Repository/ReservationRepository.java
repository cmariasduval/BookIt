package com.example.bookit.Repository;


import com.example.bookit.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserAndStatus(User user, ReservationStatus status);
    List<Reservation> findByCopy(BookCopy copy);

    Optional<Reservation> findFirstByCopyAndStatusIn(BookCopy copy, List<ReservationStatus> pending);

    List<Reservation> findByUser(User user);
}
