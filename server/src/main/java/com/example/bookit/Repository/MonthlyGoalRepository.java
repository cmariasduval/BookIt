package com.example.bookit.Repository;

import com.example.bookit.Entities.MonthlyGoal;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MonthlyGoalRepository extends JpaRepository<MonthlyGoal, Integer> {

    Optional<MonthlyGoal> findByUserAndMonthAndYear(User user, int month, int year);
    Optional<MonthlyGoal> findByUserUsernameAndMonthAndYear(String username, int month, int year);

}
