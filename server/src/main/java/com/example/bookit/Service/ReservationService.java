package com.example.bookit.Service;

import com.example.bookit.DTO.ReservationDTO;
import com.example.bookit.Entities.*;
import com.example.bookit.Repository.BookCopyRepository;
import com.example.bookit.Repository.ReservationRepository;
import com.example.bookit.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private BookCopyRepository bookCopyRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private final InfractionService infractionService;

    @Autowired
    private UserRepository userRepository;

    public ReservationService(InfractionService infractionService) {
        this.infractionService = infractionService;
    }


    // Verificar si el usuario tiene menos de 3 reservas activas
    public boolean hasActiveReservations(User user) {
        List<Reservation> activeReservations = reservationRepository.findByUserAndStatus(user, ReservationStatus.ACTIVE);
        return activeReservations.size() >= 3;
    }

    // Verificar si la copia del libro está disponible en las fechas solicitadas
    public boolean isCopyAvailable(BookCopy bookCopy, LocalDate startDate, LocalDate endDate) {
        //LocalDate endDate = startDate.plusDays(period);
        List<Reservation> reservations = reservationRepository.findByCopy(bookCopy);
        for (Reservation reservation : reservations) {
            if ((startDate.isBefore(reservation.getPickupDate()) && endDate.isAfter(reservation.getPickupDate()))
                    && reservation.getStatus() != ReservationStatus.COMPLETED
                    && reservation.getStatus() != ReservationStatus.CANCELLED) {
                return false; // Si hay una superposición de fechas y la reserva no está completada ni cancelada, no está disponible
            }
        }
        return true;
    }

    // Crear una nueva reserva
    public Reservation createReservation(User user, BookCopy bookCopy, LocalDate pickupDate, LocalDate returnDate)
    {
        if (!infractionService.puedeOperar(user)) {
            throw new RuntimeException("Usuario bloqueado. No puede realizar nuevas reservas.");
        }

        if (hasActiveReservations(user)) {
            throw new RuntimeException("No puedes tener más de 3 reservas activas.");
        }

        if (!isCopyAvailable(bookCopy, pickupDate, returnDate)) {
            throw new RuntimeException("La copia del libro no está disponible para las fechas seleccionadas.");
        }

        String bookName = bookCopy.getBook().getTitle(); // Obtener el nombre del libro desde BookCopy

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setCopy(bookCopy);
        reservation.setPickupDate(pickupDate);
        //reservation.setPickupDate(reservationDate.plusDays(period));
        reservation.setReturnDate(returnDate);
        reservation.setStatus(ReservationStatus.PENDING); // Estado inicial

        return reservationRepository.save(reservation);
    }

    // Cancelar una reserva

    public void cancelReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada."));

        if (reservation.getPickupDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("No puedes cancelar una reserva después de la fecha de pickup.");
        }

        reservationRepository.delete(reservation);
    }

    // Marcar como 'active' cuando el libro sea retirado
    @Transactional
    public void markAsActive(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada."));
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservationRepository.save(reservation);
    }

    public void markAsCompleted(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada."));
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        // Procesar devolución tardía e infracciones si corresponde
        infractionService.procesarDevolucionTardia(
                reservation.getUser(),
                Long.valueOf(reservation.getCopy().getId()),  // convertí a Long
                reservation.getPickupDate().toString(),
                LocalDate.now().toString()
        );
    }

    // Obtener los libros reservados por un usuario autenticado
    public ResponseEntity<?> getReservedBooks(String authenticatedUser) {
        List<Reservation> reservations = reservationRepository.findByUserUsername(authenticatedUser);

        // Extraer los libros de las reservas
        List<Reservation> reservedBooks = reservations;
        return ResponseEntity.ok(reservedBooks);
    }

    private ReservationDTO convertToDTO(Reservation r) {
        return new ReservationDTO(
                r.getId(),
                r.getCopy().getBook().getTitle(),
                r.getUser().getUsername(),
                r.getPickupDate().toString(), // convertir LocalDate a String yyyy-MM-dd
                r.getPeriod(),
                r.getStatus().name()
        );
    }

    public List<ReservationDTO> getPickupsToday() {
        LocalDate today = LocalDate.now();
        List<Reservation> reservations = reservationRepository.findByPickupDateAndStatus(today, ReservationStatus.PENDING);
        return reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationDTO> getLatePickups() {
        LocalDate today = LocalDate.now();
        List<Reservation> reservations = reservationRepository.findLatePickups(today);
        return reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsPickedUp(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada."));
        reservation.setStatus(ReservationStatus.ACTIVE);
        reservationRepository.save(reservation);
    }

    @Transactional
    public void markAsNotPickedUp(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada."));
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    public List<ReservationDTO> getReturnsToday() {
        List<Reservation> reservations = reservationRepository.findByReturnDate(LocalDate.now());
        return reservations.stream()
                .map(ReservationDTO::fromEntity)
                .toList();
    }

    public void cancelAllActiveReservationsByUser(User user) {
        List<Reservation> activeReservations = reservationRepository.findByUserAndStatus(user, ReservationStatus.ACTIVE);

        for (Reservation res : activeReservations) {
            reservationRepository.delete(res);  // Cancela sin restricciones
        }
    }

    public List<ReservationDTO> getReservationsByUserEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Reservation> reservations = reservationRepository.findByUser(user);
        return reservations.stream().map(ReservationDTO::fromEntity).toList();
    }

    public List<ReservationDTO> getLateReturns() {
        LocalDate today = LocalDate.now();
        List<Reservation> lateReturns = reservationRepository.findLateReturns(today);
        return lateReturns.stream().map(ReservationDTO::fromEntity).toList();
    }

    public void markAsReturned(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);
    }

    public void markAsNotReturned(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        reservation.setStatus(ReservationStatus.PENDING);
        reservationRepository.save(reservation);
    }


}
