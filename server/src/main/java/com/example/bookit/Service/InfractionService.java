package com.example.bookit.Service;

import com.example.bookit.DTO.UserInfractionDTO;
import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.InfractionRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class InfractionService {

    private final InfractionRepository infractionRepository;
    private final UserRepository userRepository;
    private final ReservationService reservationService;  // Inyección mutua

    public InfractionService(InfractionRepository infractionRepository,
                             UserRepository userRepository,
                             @Lazy ReservationService reservationService) {
        this.infractionRepository = infractionRepository;
        this.userRepository = userRepository;
        this.reservationService = reservationService;
    }

    public Infraction findByUserEmail(String email) {
        List<Infraction> infracciones = infractionRepository.findByUserEmail(email);
        return infracciones.isEmpty() ? null : infracciones.get(infracciones.size() - 1);
    }

    public void resetDebt(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (user != null) {
            List<Infraction> infracciones = infractionRepository.findByUser(user);
            infractionRepository.deleteAll(infracciones);
        }
    }

    public void registrarInfraccion(User user) {
        List<Infraction> infracciones = infractionRepository.findByUser(user);
        int nuevoConteo = infracciones.size() + 1;

        boolean debeBloquear = nuevoConteo >= 5 && !user.isBlocked();

        Infraction nueva = new Infraction(user, true, 0); // infracción activa sin multa por defecto
        infractionRepository.save(nueva);

        if (debeBloquear) {
            user.setBlocked(true);
            user.setBlockedUntil(LocalDate.now().plusMonths(3));
            userRepository.save(user);

            // Cancelar reservas activas al bloquear usuario
            reservationService.cancelAllActiveReservationsByUser(user);

            System.out.println("⚠️ Usuario " + user.getUsername() + " ha sido bloqueado por 3 meses.");
        }
    }

    public boolean puedeOperar(User user) {
        if (!user.isBlocked()) return true;

        if (LocalDate.now().isAfter(user.getBlockedUntil())) {
            // Se desbloquea pero mantiene historial
            user.setBlocked(false);
            user.setBlockedUntil(null);
            userRepository.save(user);
            return true;
        }

        return false;
    }

    public List<User> findUsersWithInfractions() {
        List<Infraction> allInfractions = infractionRepository.findAll();
        return allInfractions.stream()
                .map(Infraction::getUser)
                .distinct()
                .toList();
    }

    public List<UserInfractionDTO> getUsersWithInfractionData() {
        List<User> users = findUsersWithInfractions();

        return users.stream()
                .map(user -> new UserInfractionDTO(
                        user.getId().longValue(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getDebt(),
                        user.getInfractions().size()
                ))
                .toList();
    }

    public void resetDebtById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        user.setDebt(0);
        userRepository.save(user);
    }

    /**
     * Procesa la devolución tardía de un libro:
     * - Calcula días hábiles de atraso (excluye sábados y domingos)
     * - Si hay más de 3 días hábiles, cobra multa diaria
     * - Registra la infracción (con multa si corresponde)
     * - Bloquea usuario si tiene 5 o más infracciones
     */
    public void procesarDevolucionTardia(User user, Long bookId, String dueDate, String returnDate) {
        LocalDate due = LocalDate.parse(dueDate);
        LocalDate returned = LocalDate.parse(returnDate);

        if (returned.isAfter(due)) {
            // Contar días hábiles de atraso (excluyendo sábados y domingos)
            int diasRetrasoHabiles = contarDiasHabilesEntre(due.plusDays(1), returned);

            if (diasRetrasoHabiles > 3) {
                double multaPorDia = 2.5;
                double multaTotal = diasRetrasoHabiles * multaPorDia;

                Infraction infraction = new Infraction();
                infraction.setUser(user);
                infraction.setPaid(false);
                infraction.setDebt(multaTotal);
                infraction.setDate(LocalDate.now());
                infractionRepository.save(infraction);

                user.getInfractions().add(infraction);

                System.out.println("Multa aplicada al usuario " + user.getUsername() + ": $" + multaTotal);

                // Registrar infracción y chequear bloqueo
                registrarInfraccion(user);
            } else {
                System.out.println("Devolución tardía pero sin multa (<=3 días hábiles).");
            }
        } else {
            System.out.println("Devolución dentro del plazo, no hay multa.");
        }
    }

    private int contarDiasHabilesEntre(LocalDate start, LocalDate end) {
        int diasHabiles = 0;
        LocalDate date = start;
        while (!date.isAfter(end)) {
            DayOfWeek day = date.getDayOfWeek();
            if (day != DayOfWeek.SATURDAY && day != DayOfWeek.SUNDAY) {
                diasHabiles++;
            }
            date = date.plusDays(1);
        }
        return diasHabiles;
    }
}
