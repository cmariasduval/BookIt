package com.example.bookit.Service;

import com.example.bookit.DTO.UserInfractionDTO;
import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.InfractionRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
        // Buscar infracciones previas
        List<Infraction> infracciones = infractionRepository.findByUser(user);
        int nuevoConteo = infracciones.size() + 1;

        boolean debeBloquear = nuevoConteo >= 5 && !user.isBlocked();

        Infraction nueva = new Infraction(user, true, 0); // true indica infracción activa, 0 multa inicial
        infractionRepository.save(nueva);

        if (debeBloquear) {
            user.setBlocked(true);
            user.setBlockedUntil(LocalDate.now().plusMonths(3));
            userRepository.save(user);

            // Notificar al manager (ejemplo con println)
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
                        user.getDebt(),  // asumimos que esto lo tenés en User
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
     * - Si hay más de 3 días hábiles, cobra multa diaria (ej: 10 unidades monetarias por día)
     * - Registra la infracción (con multa si corresponde)
     * - Bloquea usuario si tiene 5 o más infracciones
     */
    public void procesarDevolucionTardia(User user, Long bookId, String dueDate, String returnDate) {
        // Parsear fechas
        LocalDate due = LocalDate.parse(dueDate);
        LocalDate returned = LocalDate.parse(returnDate);

        if (returned.isAfter(due)) {
            long diasRetraso = java.time.temporal.ChronoUnit.DAYS.between(due, returned);
            double multaPorDia = 2.5;
            double multaTotal = diasRetraso * multaPorDia;

            // Crear una nueva infracción con el monto de la multa
            Infraction infraction = new Infraction();
            infraction.setUser(user);
            infraction.setPaid(false);
            infraction.setDebt(multaTotal);
            infraction.setDate(LocalDate.now());  // o la fecha que corresponda
            infractionRepository.save(infraction);

            // Actualizar lista local de infracciones del usuario
            user.getInfractions().add(infraction);

            System.out.println("Multa aplicada al usuario " + user.getUsername() + ": $" + multaTotal);
        } else {
            System.out.println("Devolución dentro del plazo, no hay multa.");
        }
    }

    // Metodo auxiliar para contar días hábiles entre dos fechas (inclusive)
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
