package com.example.bookit.Service;

import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.InfractionRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class InfractionService {

    private final InfractionRepository infractionRepository;
    private final UserRepository userRepository;

    public InfractionService(InfractionRepository infractionRepository, UserRepository userRepository) {
        this.infractionRepository = infractionRepository;
        this.userRepository = userRepository;
    }


    public Infraction findByUserEmail(String email) {
        List<Infraction> infracciones = infractionRepository.findByUserEmail(email);
        return infracciones.isEmpty() ? null : infracciones.get(infracciones.size() - 1);    }

    public void resetDebt(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (user != null) {
            List<Infraction> infracciones = infractionRepository.findByUser(user);
            infractionRepository.deleteAll(infracciones);
        }
    }

    public void registrarInfraccion(User user) {
        // Buscar infracciones previas
        List<Infraction> infracciones = infractionRepository.findByUser(user);
        int nuevoConteo = infracciones.size() + 1;

        boolean debeBloquear = nuevoConteo >= 5 && !user.isBlocked();

        Infraction nueva = new Infraction(user, true, 0); // O false, según tu lógica
        infractionRepository.save(nueva);

        if (debeBloquear) {
            user.setBlocked(true);
            user.setBlockedUntil(LocalDate.now().plusMonths(3));
            userRepository.save(user);

            // Aquí podrías notificar al manager si tenés sistema de notificaciones
            System.out.println("⚠️ Usuario " + user.getUsername() + " ha sido bloqueado por 3 meses.");
        }
    }

    public boolean puedeOperar(User user) {
        if (!user.isBlocked()) return true;

        if (LocalDate.now().isAfter(user.getBlockedUntil())) {
            // Se cumplió el período, se desbloquea pero se mantiene el historial
            user.setBlocked(false);
            user.setBlockedUntil(null);
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public List<User> findUsersWithInfractions() {
        List<Infraction> allInfractions = infractionRepository.findAll();
        // Filtrar usuarios únicos que tienen al menos una infracción
        return allInfractions.stream()
                .map(Infraction::getUser)
                .distinct()
                .toList();
    }


}
