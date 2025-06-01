package com.example.bookit.Controllers;

import com.example.bookit.DTO.MonthlyGoalRequest;
import com.example.bookit.Entities.MonthlyGoal;
import com.example.bookit.Service.MonthlyGoalService;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/{userId}/monthly")
    public ResponseEntity<MonthlyGoal> createMonthlyGoal(@PathVariable Long userId,
                                                         @RequestBody MonthlyGoalRequest request) {
        MonthlyGoal created = goalService.setMonthlyGoal(userId, request);
        return ResponseEntity.ok(created);
    }

    // GET: Obtener la meta mensual de un usuario
    @GetMapping("/{userId}/monthly")
    public ResponseEntity<MonthlyGoal> getMonthlyGoal(@PathVariable Long userId) {
        MonthlyGoal goal = goalService.getMonthlyGoal(userId);
        if (goal != null) {
            return ResponseEntity.ok(goal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Actualizar la meta mensual de un usuario
    @PutMapping("/{userId}/monthly")
    public ResponseEntity<MonthlyGoal> updateMonthlyGoal(@PathVariable Long userId,
                                                         @RequestBody MonthlyGoalRequest request) {
        MonthlyGoal updated = goalService.updateMonthlyGoal(userId, request);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
