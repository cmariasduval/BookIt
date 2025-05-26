package com.example.bookit.Controllers;

import com.example.bookit.Entities.User;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.InfractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/infractions")
public class InfractionController {

    private final InfractionService infractionService;
    private final UserRepository userRepository;

    public InfractionController(InfractionService infractionService, UserRepository userRepository) {
        this.infractionService = infractionService;
        this.userRepository = userRepository;
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
    @PutMapping("/unlock/{userId}")
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

    // GET: Obtener usuarios con infracciones pendientes
    @GetMapping("/pending")
    public ResponseEntity<List<User>> getUsersWithInfractions() {
        List<User> usersWithInfractions = infractionService.findUsersWithInfractions();
        return ResponseEntity.ok(usersWithInfractions);
    }

    // PUT: Resetear deuda de un usuario por ID
    @PutMapping("/{userId}/clear-debt")
    public ResponseEntity<Void> resetDebt(@PathVariable Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        infractionService.resetDebt(optionalUser.get().getEmail());
        return ResponseEntity.ok().build();
    }
}
