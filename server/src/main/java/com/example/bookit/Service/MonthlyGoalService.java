package com.example.bookit.Service;

import com.example.bookit.DTO.MonthlyGoalRequest;
import com.example.bookit.Entities.MonthlyGoal;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.MonthlyGoalRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MonthlyGoalService {

    private final MonthlyGoalRepository goalRepository;
    private final UserRepository userRepository;

    public MonthlyGoalService(MonthlyGoalRepository goalRepository, UserRepository userRepository) {
        this.goalRepository = goalRepository;
        this.userRepository = userRepository;
    }

    public MonthlyGoal setMonthlyGoal(String userId, MonthlyGoalRequest request) {
        User user = userRepository.findByUsername(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Optional<MonthlyGoal> existing = goalRepository.findByUserAndMonthAndYear(user, request.getMonth(), request.getYear());
        if (existing.isPresent()) {
            var goal = existing.get();
            goal.setBookCount(request.getBookCount());
            goal.setMonth(request.getMonth());
            goal.setYear(request.getYear());
            return goalRepository.save(goal);
        }

        MonthlyGoal goal = new MonthlyGoal(
                request.getBookCount(),
                request.getMonth(),
                request.getYear()
        );
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    // ✅ Obtener la meta mensual
    public MonthlyGoal getMonthlyGoal(String userId) {
        User user = userRepository.findByUsername(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Asumimos que se busca la meta del mes actual
        int currentMonth = java.time.LocalDate.now().getMonthValue();
        int currentYear = java.time.LocalDate.now().getYear();

        return goalRepository.findByUserAndMonthAndYear(user, currentMonth, currentYear)
                .orElse(null);
    }

    // ✅ Actualizar la meta mensual
    public MonthlyGoal updateMonthlyGoal(String userId, MonthlyGoalRequest request) {
        User user = userRepository.findByUsername(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        MonthlyGoal goal = goalRepository.findByUserAndMonthAndYear(user, request.getMonth(), request.getYear())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró un objetivo para actualizar"));

        goal.setBookCount(request.getBookCount());

        return goalRepository.save(goal);
    }
}
