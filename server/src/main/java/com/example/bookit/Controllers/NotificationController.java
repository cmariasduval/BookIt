package com.example.bookit.Controllers;

import com.example.bookit.Service.EmailNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private EmailNotificationService emailNotificationService;

    /**
     * Ejecutar manualmente todas las notificaciones (para testing)
     */
    @PostMapping("/send-all")
    public ResponseEntity<String> sendAllNotifications() {
        try {
            emailNotificationService.sendDailyNotifications();
            return ResponseEntity.ok("Todas las notificaciones han sido enviadas exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error enviando notificaciones: " + e.getMessage());
        }
    }

    /**
     * Enviar solo recordatorios de retiro
     */
    @PostMapping("/send-pickup-reminders")
    public ResponseEntity<String> sendPickupReminders() {
        try {
            emailNotificationService.sendPickupReminders();
            return ResponseEntity.ok("Recordatorios de retiro enviados");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Enviar solo recordatorios de devolución
     */
    @PostMapping("/send-return-reminders")
    public ResponseEntity<String> sendReturnReminders() {
        try {
            emailNotificationService.sendReturnReminders();
            return ResponseEntity.ok("Recordatorios de devolución enviados");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Enviar notificaciones de libros vencidos
     */
    @PostMapping("/send-overdue-notifications")
    public ResponseEntity<String> sendOverdueNotifications() {
        try {
            emailNotificationService.sendOverdueNotifications();
            return ResponseEntity.ok("Notificaciones de libros vencidos enviadas");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Enviar notificaciones de infracciones
     */
    @PostMapping("/send-infraction-notifications")
    public ResponseEntity<String> sendInfractionNotifications() {
        try {
            emailNotificationService.sendInfractionNotifications();
            return ResponseEntity.ok("Notificaciones de infracciones enviadas");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Enviar email personalizado
     */
    @PostMapping("/send-custom")
    public ResponseEntity<String> sendCustomNotification(
            @RequestParam String email,
            @RequestParam String subject,
            @RequestParam String body) {
        try {
            emailNotificationService.sendManualNotification(email, subject, body);
            return ResponseEntity.ok("Email personalizado enviado a " + email);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}