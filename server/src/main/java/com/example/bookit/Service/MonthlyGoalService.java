package com.example.bookit.Service;

import com.example.bookit.DTO.MonthlyGoalRequest;
import com.example.bookit.DTO.MonthlyGoalStatsResponse;
import com.example.bookit.Entities.MonthlyGoal;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.MonthlyGoalRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
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
                request.getYear(),
                request.getBooksRead() == 0 ? 0 : request.getBooksRead()
        );
        goal.setUser(user);
        return goalRepository.save(goal);
    }

    // Obtener la meta mensual (mes actual si no se especifica)
    public MonthlyGoal getMonthlyGoal(String username) {
        LocalDate now = LocalDate.now();
        return getMonthlyGoal(username, now.getMonthValue(), now.getYear());
    }

    // Obtener la meta mensual para un mes/año específico
    public MonthlyGoal getMonthlyGoal(String username, Integer month, Integer year) {
        LocalDate now = LocalDate.now();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        int targetYear = (year != null) ? year : now.getYear();

        return goalRepository.findByUserUsernameAndMonthAndYear(username, targetMonth, targetYear)
                .orElse(null);
    }

    // Actualizar la meta mensual
    public MonthlyGoal updateMonthlyGoal(String userId, MonthlyGoalRequest request) {
        User user = userRepository.findByUsername(userId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        MonthlyGoal goal = goalRepository.findByUserAndMonthAndYear(user, request.getMonth(), request.getYear())
                .orElseThrow(() -> new IllegalArgumentException("No se encontró un objetivo para actualizar"));

        goal.setBookCount(request.getBookCount());
        return goalRepository.save(goal);
    }

    public MonthlyGoal incrementBooksRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        MonthlyGoal goal = goalRepository
                .findByUserAndMonthAndYear(user, month, year)
                .orElseThrow(() -> new RuntimeException("Monthly goal not set"));

        if (goal.getBooksRead() < goal.getBookCount()) {
            goal.setBooksRead(goal.getBooksRead() + 1);
            return goalRepository.save(goal);
        }

        return goal;
    }

    // Obtener estadísticas del mes actual
    public MonthlyGoalStatsResponse getMonthlyGoalStats(String username) {
        LocalDate now = LocalDate.now();
        return getMonthlyGoalStats(username, now.getMonthValue(), now.getYear());
    }

    // Obtener estadísticas para un mes/año específico
    public MonthlyGoalStatsResponse getMonthlyGoalStats(String username, Integer month, Integer year) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        LocalDate now = LocalDate.now();
        int targetMonth = (month != null) ? month : now.getMonthValue();
        int targetYear = (year != null) ? year : now.getYear();

        MonthlyGoal goal = goalRepository.findByUserAndMonthAndYear(user, targetMonth, targetYear)
                .orElse(null);

        if (goal == null) {
            return null;
        }

        // Determinar si es el mes actual o un mes pasado
        boolean isCurrentMonth = (targetMonth == now.getMonthValue() && targetYear == now.getYear());
        boolean isPastMonth = (targetYear < now.getYear()) ||
                (targetYear == now.getYear() && targetMonth < now.getMonthValue());

        // Calcular estadísticas básicas
        int targetBooks = goal.getBookCount();
        int booksRead = goal.getBooksRead();
        int booksRemaining = Math.max(0, targetBooks - booksRead);
        double progressPercentage = targetBooks > 0 ? (double) booksRead / targetBooks * 100 : 0;

        // Calcular días
        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        int daysInMonth = yearMonth.lengthOfMonth();

        int dayOfMonth;
        int daysRemaining;

        if (isCurrentMonth) {
            // Para el mes actual, usar el día actual
            dayOfMonth = now.getDayOfMonth();
            daysRemaining = daysInMonth - dayOfMonth;
        } else if (isPastMonth) {
            // Para meses pasados, usar el último día del mes
            dayOfMonth = daysInMonth;
            daysRemaining = 0;
        } else {
            // Para meses futuros, aún no han comenzado
            dayOfMonth = 0;
            daysRemaining = daysInMonth;
        }

        // Calcular ritmo
        double dailyPaceNeeded = daysRemaining > 0 ? (double) booksRemaining / daysRemaining : 0;
        double currentPace = dayOfMonth > 0 ? (double) booksRead / dayOfMonth : 0;

        // Determinar estado
        String status;
        boolean isAchieved = booksRead >= targetBooks;

        if (isPastMonth) {
            // Para meses pasados, solo importa si se logró o no
            status = isAchieved ? "achieved" : "not_achieved";
        } else if (isAchieved) {
            status = "achieved";
        } else if (isCurrentMonth) {
            // Para el mes actual, evaluar progreso
            double expectedProgress = (double) dayOfMonth / daysInMonth;
            double actualProgress = (double) booksRead / targetBooks;

            if (actualProgress >= expectedProgress) {
                status = "on_track";
            } else {
                status = "behind";
            }
        } else {
            // Mes futuro
            status = "not_started";
        }

        // Obtener nombre del mes
        String monthName = YearMonth.of(targetYear, targetMonth).getMonth().name();

        return new MonthlyGoalStatsResponse(
                targetBooks, booksRead, booksRemaining, progressPercentage,
                daysInMonth, daysRemaining, dailyPaceNeeded, currentPace,
                status, isAchieved, monthName, targetYear
        );
    }
}