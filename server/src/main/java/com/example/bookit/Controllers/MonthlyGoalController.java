package com.example.bookit.Controllers;

import com.example.bookit.DTO.MonthlyGoalRequest;
import com.example.bookit.DTO.MonthlyGoalStatsResponse;
import com.example.bookit.Entities.MonthlyGoal;
import com.example.bookit.Service.MonthlyGoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "http://localhost:3000")
public class MonthlyGoalController {

    private final MonthlyGoalService goalService;

    public MonthlyGoalController(MonthlyGoalService goalService) {
        this.goalService = goalService;
    }

    // POST: Crear una nueva meta mensual
    @PostMapping("/monthly")
    public ResponseEntity<MonthlyGoal> createMonthlyGoal(@RequestBody MonthlyGoalRequest request) {
        MonthlyGoal created = goalService.setMonthlyGoal(getAuthenticatedUser(), request);
        return ResponseEntity.ok(created);
    }

    // GET: Obtener la meta mensual de un usuario (mes actual por defecto)
    @GetMapping("/monthly")
    public ResponseEntity<MonthlyGoal> getMonthlyGoal(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        String username = getAuthenticatedUser();
        MonthlyGoal goal = goalService.getMonthlyGoal(username, month, year);
        if (goal != null) {
            return ResponseEntity.ok(goal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Actualizar la meta mensual de un usuario
    @PutMapping("/monthly")
    public ResponseEntity<MonthlyGoal> updateMonthlyGoal(@RequestBody MonthlyGoalRequest request) {
        MonthlyGoal updated = goalService.updateMonthlyGoal(getAuthenticatedUser(), request);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // POST: Incrementar libros leídos
    @PostMapping("/monthly/increment")
    public ResponseEntity<MonthlyGoal> incrementBooksRead() {
        String username = getAuthenticatedUser();
        MonthlyGoal updatedGoal = goalService.incrementBooksRead(username);
        return ResponseEntity.ok(updatedGoal);
    }

    // GET: Obtener estadísticas de la meta mensual (mes actual por defecto)
    @GetMapping("/monthly/stats")
    public ResponseEntity<MonthlyGoalStatsResponse> getMonthlyGoalStats(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        String username = getAuthenticatedUser();
        MonthlyGoalStatsResponse stats = goalService.getMonthlyGoalStats(username, month, year);
        if (stats != null) {
            return ResponseEntity.ok(stats);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}