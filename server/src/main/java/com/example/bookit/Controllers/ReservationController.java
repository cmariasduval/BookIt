package com.example.bookit.Controllers;

import com.example.bookit.DTO.ReservationDTO;
import com.example.bookit.DTO.ReservationRequest;
import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Reservation;  // Importa la clase Reservation
import com.example.bookit.Repository.ReservationRepository;
import com.example.bookit.Service.BookCopyService;
import com.example.bookit.Service.ReservationService;
import com.example.bookit.Service.UserService;   // Asumí que tienes un servicio para User
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000")

public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;  // Servicio para acceder a la base de datos de User

    @Autowired
    private BookCopyService bookCopyService;

    @Autowired
    private ReservationRepository reservationRepository;

    // Servicio para acceder a la base de datos de BookCopy


    @GetMapping("/get")
    public ResponseEntity<?> getReservedBooks() {
        return reservationService.getReservedBooks(getAuthenticatedUser());
    }

        // Endpoint para crear una nueva reserva

    @PostMapping("/create")
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            User user = userService.getUserByName(getAuthenticatedUser());
            BookCopy bookCopy = bookCopyService.getBookCopyById(request.copyId);

            if (user == null || bookCopy == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario o copia de libro no encontrados");
            }

            // Validar bloqueo del usuario
            if (user.isBlocked() && user.getBlockedUntil() != null && user.getBlockedUntil().isAfter(LocalDate.now())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("No podés reservar libros porque estás bloqueado hasta " + user.getBlockedUntil());
            }

            LocalDate pickupDate = LocalDate.parse(request.pickupDate);
            LocalDate returnDate = pickupDate.plusDays(request.period);

            Reservation reservation = reservationService.createReservation(
                    user,
                    bookCopy,
                    pickupDate,
                    returnDate
            );
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

    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @GetMapping("/pickups-today")
    public List<ReservationDTO> getPickupsToday() {
        return reservationService.getPickupsToday();
    }

    @GetMapping("/late-pickups")
    public List<ReservationDTO> getLatePickups() {
        return reservationService.getLatePickups();
    }

    @PostMapping("/{id}/mark-picked-up")
    public ResponseEntity<?> markPickedUp(@PathVariable Long id) {
        reservationService.markAsPickedUp(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/mark-not-picked-up")
    public ResponseEntity<?> markNotPickedUp(@PathVariable Long id) {
        reservationService.markAsNotPickedUp(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/returns-today")
    public List<ReservationDTO> getReturnsToday() {
        System.out.println("🔁 Entró al endpoint /returns-today");
        return reservationService.getReturnsToday();
    }


    @GetMapping("/user")
    public List<ReservationDTO> getReservationsForCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return reservationService.getReservationsByUserEmail(email);
    }

    @GetMapping("/late-returns")
    public List<ReservationDTO> getLateReturns() {
        return reservationService.getLateReturns();
    }

    @PutMapping("/{id}/mark-returned")
    public ResponseEntity<Void> markAsReturned(@PathVariable Long id) {
        reservationService.markAsReturned(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/mark-not-returned")
    public ResponseEntity<Void> markAsNotReturned(@PathVariable Long id) {
        reservationService.markAsNotReturned(id);
        return ResponseEntity.ok().build();
    }





}
