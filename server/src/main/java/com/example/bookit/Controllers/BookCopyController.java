package com.example.bookit.Controllers;

import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Entities.Reservation;
import com.example.bookit.Entities.ReservationStatus;
import com.example.bookit.Repository.BookCopyRepository;
import com.example.bookit.Repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/book-copies")
public class BookCopyController {

    @Autowired
    private BookCopyRepository bookCopyRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @PutMapping("/{id}/reserve")
    public ResponseEntity<?> reserveCopy(@PathVariable Long id) {
        Optional<BookCopy> optionalCopy = bookCopyRepository.findById(id);

        if (optionalCopy.isPresent()) {
            BookCopy copy = optionalCopy.get();
            if (!copy.isAvailable()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Already reserved");
            }
            copy.setAvailable(false);
            bookCopyRepository.save(copy);
            Reservation reservation = new Reservation();

            return ResponseEntity.ok(copy);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelCopy(@PathVariable Long id) {
        Optional<BookCopy> optionalCopy = bookCopyRepository.findById(id);

        if (optionalCopy.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BookCopy copy = optionalCopy.get();

        // Buscar la reserva pendiente o activa asociada a esta copia
        Optional<Reservation> optionalReservation = reservationRepository
                .findFirstByCopyAndStatusIn(copy, List.of(ReservationStatus.PENDING, ReservationStatus.ACTIVE));

        if (optionalReservation.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No active or pending reservation found for this copy.");
        }

        // Cancelar la reserva y marcar la copia como disponible
        Reservation reservation = optionalReservation.get();
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);

        copy.setAvailable(true);
        bookCopyRepository.save(copy);

        return ResponseEntity.ok("Reservation cancelled and book copy is now available.");
    }


}
