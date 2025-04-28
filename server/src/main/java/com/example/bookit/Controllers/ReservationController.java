package com.example.bookit.Controllers;

import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Reservation;  // Importa la clase Reservation
import com.example.bookit.Service.BookCopyService;
import com.example.bookit.Service.ReservationService;
import com.example.bookit.Service.UserService;   // Asumí que tienes un servicio para User
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;  // Servicio para acceder a la base de datos de User

    @Autowired
    private BookCopyService bookCopyService;  // Servicio para acceder a la base de datos de BookCopy

    // Endpoint para crear una nueva reserva
    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestParam("userId") Long userId,
                                               @RequestParam("copyId") Long copyId,
                                               @RequestParam("reservationDate") String reservationDate,
                                               @RequestParam("period") int period) {
        try {
            User user = userService.getUserById(userId);
            BookCopy bookCopy = bookCopyService.getBookCopyById(copyId);

            if (user == null || bookCopy == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario o copia de libro no encontrados");
            }

            Reservation reservation = reservationService.createReservation(user, bookCopy, LocalDate.parse(reservationDate), period);
            return ResponseEntity.status(HttpStatus.CREATED).body(reservation);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


    // Endpoint para cancelar una reserva
    @DeleteMapping("/cancel/{reservationId}")
    public void cancelReservation(@PathVariable Long reservationId) {  // Cambié el tipo a Long
        reservationService.cancelReservation(reservationId);
    }

    // Endpoint para marcar una reserva como activa (cuando el libro es retirado)
    @PostMapping("/activate/{reservationId}")
    public void activateReservation(@PathVariable Long reservationId) {  // Cambié el tipo a Long
        reservationService.markAsActive(reservationId);
    }

    // Endpoint para marcar una reserva como completada (cuando el libro es devuelto)
    @PostMapping("/complete/{reservationId}")
    public void completeReservation(@PathVariable Long reservationId) {  // Cambié el tipo a Long
        reservationService.markAsCompleted(reservationId);
    }
}
