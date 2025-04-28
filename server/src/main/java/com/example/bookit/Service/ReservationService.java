package com.example.bookit.Service;

import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Entities.Reservation;
import com.example.bookit.Entities.ReservationStatus;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.BookCopyRepository;
import com.example.bookit.Repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReservationService{

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private BookCopyRepository bookCopyRepository;

    // Verificar si el usuario tiene menos de 3 reservas activas
    public boolean hasActiveReservations(User user) {
        List<Reservation> activeReservations = reservationRepository.findByUserAndStatus(user, ReservationStatus.ACTIVE);
        return activeReservations.size() >= 3;
    }

    // Verificar si la copia del libro está disponible en las fechas solicitadas
    public boolean isCopyAvailable(BookCopy bookCopy, LocalDate startDate, int period) {
        LocalDate endDate = startDate.plusDays(period);
        List<Reservation> reservations = reservationRepository.findByCopy(bookCopy);
        for (Reservation reservation : reservations) {
            if ((startDate.isBefore(reservation.getPickupDate()) && endDate.isAfter(reservation.getReservationDate()))
                    && reservation.getStatus() != ReservationStatus.COMPLETED
                    && reservation.getStatus() != ReservationStatus.CANCELLED) {
                return false; // Si hay una superposición de fechas y la reserva no está completada ni cancelada, no está disponible
            }
        }
        return true;
    }

    // Crear una nueva reserva
    public Reservation createReservation(User user, BookCopy bookCopy, LocalDate reservationDate, int period) {
        if (hasActiveReservations(user)) {
            throw new RuntimeException("No puedes tener más de 3 reservas activas.");
        }

        if (!isCopyAvailable(bookCopy, reservationDate, period)) {
            throw new RuntimeException("La copia del libro no está disponible para las fechas seleccionadas.");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCopy(bookCopy);
        reservation.setReservationDate(reservationDate);
        reservation.setPickupDate(reservationDate.plusDays(period));
        reservation.setPeriod(period);
        reservation.setStatus(ReservationStatus.PENDING); // Estado inicial

        return reservationRepository.save(reservation);
    }

    // Cancelar una reserva
    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new RuntimeException("Reserva no encontrada."));

        if (reservation.getPickupDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("No puedes cancelar una reserva después de la fecha de pickup.");
        }

        reservationRepository.delete(reservation);
    }

    // Marcar como 'active' cuando el libro sea retirado

    @Transactional
    public void markAsActive(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new RuntimeException("Reserva no encontrada."));
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservationRepository.save(reservation);
    }

    // Marcar como 'completed' cuando el libro sea devuelto
    public void markAsCompleted(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new RuntimeException("Reserva no encontrada."));
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);
    }
}
