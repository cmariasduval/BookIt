package com.example.bookit.Controllers;

import com.example.bookit.DTO.UserInfractionDTO;
import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.InfractionRepository;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.InfractionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/infractions")
@CrossOrigin(origins = "http://localhost:3000")

public class InfractionController {

    private final InfractionService infractionService;
    private final UserRepository userRepository;
    private final InfractionRepository infractionRepository;

    public InfractionController(InfractionService infractionService, UserRepository userRepository, InfractionRepository infractionRepository) {
        this.infractionService = infractionService;
        this.userRepository = userRepository;
        this.infractionRepository = infractionRepository;
    }

    // POST: Registrar infracción para un usuario
    @PostMapping("/register/{userId}")
    public ResponseEntity<?> registrarInfraccion(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        infractionService.registrarInfraccion(optionalUser.get());
        return ResponseEntity.ok("Infracción registrada.");
    }

    // GET: Verificar si un usuario está bloqueado
    @GetMapping("/status/{userId}")
    public ResponseEntity<?> estadoUsuario(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        boolean puedeOperar = infractionService.puedeOperar(user);
        if (puedeOperar) {
            return ResponseEntity.ok("El usuario puede operar.");
        } else {
            return ResponseEntity.ok("El usuario está bloqueado hasta " + user.getBlockedUntil());
        }
    }

    // PUT: Desbloquear manualmente (opcional, para manager)
    @PutMapping("/unblock/{userId}")
    public ResponseEntity<?> desbloquearUsuario(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setBlocked(false);
        user.setBlockedUntil(null);
        userRepository.save(user);

        return ResponseEntity.ok("Usuario desbloqueado manualmente.");
    }

    // GET: Obtener usuarios con infracciones pendientes o bloqueados
    @GetMapping("/pending")
    public ResponseEntity<List<UserInfractionDTO>> getUsersWithInfractions() {
        List<User> users = userRepository.findUsersWithInfractionsOrBlocked();

        List<UserInfractionDTO> dtos = users.stream()
                .map(user -> new UserInfractionDTO(
                        user.getId().longValue(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getDebt(),
                        user.getInfractionsCount(),
                        user.isBlocked()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }



    @PutMapping("/users/{id}/pay-debt")
    public ResponseEntity<Void> payDebt(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        for (Infraction inf : user.getInfractions()) {
            inf.setDebt(0);
            infractionRepository.save(inf); // ¡No te olvides de guardar!
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/return-late/{userId}/{bookId}")
    public ResponseEntity<?> procesarDevolucionTardia(
            @PathVariable Long userId,
            @PathVariable Long bookId,
            @RequestParam String dueDate,     // fecha límite (ej: 2025-05-25)
            @RequestParam String returnDate)  // fecha de devolución (ej: 2025-05-30)
    {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        try {
            infractionService.procesarDevolucionTardia(user, bookId, dueDate, returnDate);
            return ResponseEntity.ok("Devolución procesada, multa y/o infracción registrada.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al procesar devolución: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/clear-debt")
    public ResponseEntity<Void> resetDebt(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            infractionService.resetDebt(optionalUser.get().getEmail());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/block/{username}")
    public ResponseEntity<?> bloquearUsuario(@PathVariable String username) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setBlocked(true);
        user.setBlockedUntil(LocalDate.now().plusDays(90));
        userRepository.save(user);

        return ResponseEntity.ok("Usuario " + username + " bloqueado por 90 días.");
    }


    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }


}
