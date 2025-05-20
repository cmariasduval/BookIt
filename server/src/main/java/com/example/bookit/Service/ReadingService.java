package com.example.bookit.Service;

import com.example.bookit.Entities.*;
import com.example.bookit.Repository.ReadingRepository;
import com.example.bookit.Repository.ReservationRepository;


import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReadingService {

    private final ReadingRepository readingRepository;
    private final ReservationRepository reservationRepository;


    public ReadingService(ReadingRepository readingRepository, ReservationRepository reservationRepository) {
        this.readingRepository = readingRepository;
        this.reservationRepository = reservationRepository;
    }

    public void handInReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("No reservation with id " + reservationId));

        // Crear nuevo Reading con fechas correctas
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(reservation.getPeriod());
        BookCopy copy = reservation.getCopy();

        // Crear y guardar el Reading
        Reading reading = new Reading(copy, reservation.getUser(), startDate);
        reading.setReturned(false);
        reading.setEndDate(endDate);
        copy.setAvailable(false); // marca como no disponible
        readingRepository.save(reading);

        // Marcar reserva como cumplida
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);
    }

    public List<Reading> getCurrentReadingsByUser(Long userId) {
        return readingRepository.findByUserIdAndReturnedFalse(userId);
    }


    public List<User> getUsersInInfraction() {
        return readingRepository.findDistinctUsersInInfraction(LocalDate.now());
    }
}
