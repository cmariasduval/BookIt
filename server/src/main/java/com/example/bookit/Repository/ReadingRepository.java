package com.example.bookit.Repository;

import com.example.bookit.Entities.Reading;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, Integer> {

    // Libros que está leyendo actualmente un usuario
    List<Reading> findByUserAndReturnedFalse(User user);

    // Todos los readings no devueltos que vencieron
    List<Reading> findByReturnedFalseAndEndDateBefore(LocalDate today);

    // Devueltos en un día específico
    List<Reading> findByReturnedTrueAndEndDate(LocalDate day);

    // Todos los readings de un usuario, ordenados por fecha de fin
    List<Reading> findByUserOrderByEndDateAsc(User user);

    List<Reading> findByUserIdAndReturnedFalse(Long userId);

    @Query("""
       SELECT DISTINCT r.user
       FROM Reading r
       WHERE r.returned = false
         AND r.endDate < :today
    """)
    List<User> findDistinctUsersInInfraction(@Param("today") LocalDate today);
}
