package com.example.bookit.Service;

import com.example.bookit.DTO.ReservationDTO;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Reservation;
import com.example.bookit.Repository.ReservationRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmailNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Tarea programada que se ejecuta todos los días a las 9:00 AM
     * para enviar todas las notificaciones
     */
    @Scheduled(cron = "0 0 9 * * ?") // Todos los días a las 9:00 AM
    public void sendDailyNotifications() {
        sendPickupReminders();
        sendReturnReminders();
        sendOverdueNotifications();
        sendInfractionNotifications();
    }

    /**
     * Envía recordatorios para libros que deben ser retirados mañana
     */
    public void sendPickupReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);

        // Usar el método existente de tu ReservationService
        List<ReservationDTO> pickupsTomorrow = reservationService.getPickupsToday(); // Ajustar según tu lógica

        for (ReservationDTO reservationDTO : pickupsTomorrow) {
            sendPickupReminderEmail(reservationDTO);
        }
    }

    /**
     * Envía recordatorios para libros que deben ser devueltos mañana
     */
    public void sendReturnReminders() {
        // Usar el método existente de tu ReservationService
        List<ReservationDTO> returnsTomorrow = reservationService.getReturnsToday(); // Ajustar según tu lógica

        for (ReservationDTO reservationDTO : returnsTomorrow) {
            sendReturnReminderEmail(reservationDTO);
        }
    }

    /**
     * Envía notificaciones diarias para libros vencidos (no devueltos)
     */
    public void sendOverdueNotifications() {
        // Usar el método existente de tu ReservationService
        List<ReservationDTO> overdueReservations = reservationService.getLateReturns();

        for (ReservationDTO reservationDTO : overdueReservations) {
            sendOverdueNotificationEmail(reservationDTO);
        }
    }

    /**
     * Envía notificaciones sobre infracciones y bloqueos
     */
    public void sendInfractionNotifications() {
        // Buscar usuarios con infracciones - ajustar según tu estructura
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            if (user.isBlocked()) {
                sendBlockedUserNotification(user);
            } else if (user.getDebt() > 0) {
                sendInfractionNotification(user);
            }
        }
    }

    /**
     * Envía email de recordatorio para retirar libro
     */
    private void sendPickupReminderEmail(ReservationDTO reservation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Buscar el email del usuario
            User user = userRepository.findByUsername(reservation.getUserName()).orElse(null);
            if (user == null) return; // Si no encontramos el usuario, salir

            message.setTo(user.getEmail());
            message.setSubject("📚 Recordatorio: Retirá tu libro mañana - BookIt");

            String body = String.format(
                    "¡Hola %s!\n\n" +
                            "Te recordamos que mañana tenés que retirar el libro:\n\n" +
                            "📖 %s\n\n" +
                            "Horarios de retiro: Lunes a Viernes de 9:00 a 18:00\n\n" +
                            "Si no podés retirarlo, recordá cancelar tu reserva para que otros usuarios puedan acceder al libro.\n\n" +
                            "¡Gracias por usar BookIt!\n" +
                            "El equipo de BookIt",
                    reservation.getUserName(),
                    reservation.getBookTitle()
            );

            message.setText(body);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Error enviando email de recordatorio de retiro: " + e.getMessage());
        }
    }

    /**
     * Envía email de recordatorio para devolver libro
     */
    private void sendReturnReminderEmail(ReservationDTO reservation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Buscar el email del usuario
            User user = userRepository.findByUsername(reservation.getUserName()).orElse(null);
            if (user == null) return; // Si no encontramos el usuario, salir

            message.setTo(user.getEmail());
            message.setSubject("📅 Recordatorio: Devolvé tu libro mañana - BookIt");

            String body = String.format(
                    "¡Hola %s!\n\n" +
                            "Te recordamos que mañana tenés que devolver el libro:\n\n" +
                            "📖 %s\n\n" +
                            "Horarios de devolución: Lunes a Viernes de 9:00 a 18:00\n\n" +
                            "⚠️ Recordá que las devoluciones tardías generan multas:\n" +
                            "• $100 por día de retraso\n" +
                            "• Después de 7 días: suspensión temporal\n\n" +
                            "¡Gracias por usar BookIt responsablemente!\n" +
                            "El equipo de BookIt",
                    reservation.getUserName(),
                    reservation.getBookTitle()
            );

            message.setText(body);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Error enviando email de recordatorio de devolución: " + e.getMessage());
        }
    }

    /**
     * Envía notificación diaria para libros vencidos
     */
    private void sendOverdueNotificationEmail(ReservationDTO reservation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // Buscar el email del usuario
            User user = userRepository.findByUsername(reservation.getUserName()).orElse(null);
            if (user == null) return; // Si no encontramos el usuario, salir

            message.setTo(user.getEmail());
            message.setSubject("🚨 URGENTE: Libro vencido - Devolvelo ya - BookIt");

            String body = String.format(
                    "¡Hola %s!\n\n" +
                            "🚨 TIENES UN LIBRO VENCIDO 🚨\n\n" +
                            "El siguiente libro debía ser devuelto y está atrasado:\n\n" +
                            "📖 %s\n\n" +
                            "⚠️ IMPORTANTE:\n" +
                            "• Devolvé el libro inmediatamente\n" +
                            "• Las multas siguen aumentando $100 por día\n" +
                            "• Después de 7 días de retraso serás suspendido\n\n" +
                            "Horarios de devolución: Lunes a Viernes de 9:00 a 18:00\n\n" +
                            "Por favor, contactanos si tenés algún problema.\n\n" +
                            "El equipo de BookIt",
                    reservation.getUserName(),
                    reservation.getBookTitle()
            );

            message.setText(body);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Error enviando email de libro vencido: " + e.getMessage());
        }
    }

    /**
     * Envía notificación sobre infracciones pendientes
     */
    private void sendInfractionNotification(User user) {
        try {
            double totalDebt = user.getDebt();

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("⚠️ Tenés infracciones pendientes - BookIt");

            String body = String.format(
                    "¡Hola %s!\n\n" +
                            "Te informamos que tenés infracciones pendientes en tu cuenta:\n\n" +
                            "📊 Resumen de tu cuenta:\n" +
                            "• Deuda total: $%.2f\n\n" +
                            "💡 Para seguir usando BookIt:\n" +
                            "• Pagá tus multas pendientes\n" +
                            "• Devolvé cualquier libro que tengas vencido\n\n" +
                            "⚠️ Si no regularizás tu situación, tu cuenta será suspendida.\n\n" +
                            "Para pagar tus multas, acercate a la biblioteca o contactanos.\n\n" +
                            "El equipo de BookIt",
                    user.getUsername(),
                    totalDebt
            );

            message.setText(body);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Error enviando email de infracciones: " + e.getMessage());
        }
    }

    /**
     * Envía notificación de cuenta bloqueada
     */
    private void sendBlockedUserNotification(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("🚫 Tu cuenta ha sido bloqueada - BookIt");

            String body = String.format(
                    "¡Hola %s!\n\n" +
                            "🚫 Tu cuenta de BookIt ha sido BLOQUEADA 🚫\n\n" +
                            "📅 Bloqueado hasta: %s\n" +
                            "💰 Deuda pendiente: $%.2f\n\n" +
                            "🔐 Mientras tu cuenta esté bloqueada NO PODRÁS:\n" +
                            "• Hacer nuevas reservas\n" +
                            "• Retirar libros\n" +
                            "• Acceder a algunos servicios\n\n" +
                            "✅ Para desbloquear tu cuenta:\n" +
                            "• Pagá todas tus multas pendientes\n" +
                            "• Devolvé cualquier libro que tengas vencido\n" +
                            "• Contactá al administrador si creés que es un error\n\n" +
                            "📞 Contacto: biblioteca@example.com\n\n" +
                            "El equipo de BookIt",
                    user.getUsername(),
                    user.getBlockedUntil() != null ? user.getBlockedUntil().toString() : "Indefinido",
                    user.getDebt()
            );

            message.setText(body);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Error enviando email de cuenta bloqueada: " + e.getMessage());
        }
    }

    /**
     * Método manual para enviar notificación específica
     */
    public void sendManualNotification(String email, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error enviando email manual: " + e.getMessage());
        }
    }
}