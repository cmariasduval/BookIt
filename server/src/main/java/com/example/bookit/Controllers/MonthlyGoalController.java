package com.example.bookit.Controllers;

import com.example.bookit.DTO.MonthlyGoalRequest;
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

    // GET: Obtener la meta mensual de un usuario
    @GetMapping("/getGoal")
    public ResponseEntity<MonthlyGoal> getMonthlyGoal() {
        String username = getAuthenticatedUser();
        MonthlyGoal goal = goalService.getMonthlyGoal(username);
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

    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}
