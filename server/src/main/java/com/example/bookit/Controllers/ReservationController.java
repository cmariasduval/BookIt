package com.example.bookit.Controllers;

import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Reservation;  // Importa la clase Reservation
import com.example.bookit.Service.BookCopyService;
import com.example.bookit.Service.ReservationService;
import com.example.bookit.Service.UserService;   // Asumí que tienes un servicio para User
import org.springframework.beans.factory.annotation.Autowired;
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
    public Reservation createReservation(@RequestParam("userId") Long userId,
                                         @RequestParam("copyId") Long copyId,
                                         @RequestParam("reservationDate") String reservationDate,
                                         @RequestParam("period") int period) {

        User user = userService.getUserById(userId);  // Recupera el usuario desde la base de datos
        BookCopy bookCopy = bookCopyService.getBookCopyById(copyId);  // Recupera la copia de libro desde la base de datos

        // Asegúrate de que los objetos recuperados no sean nulos antes de proceder
        if (user == null || bookCopy == null) {
            throw new RuntimeException("Usuario o copia de libro no encontrados");
        }

        return reservationService.createReservation(user, bookCopy, LocalDate.parse(reservationDate), period);
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
