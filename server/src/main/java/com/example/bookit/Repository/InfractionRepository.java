package com.example.bookit.Repository;

import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InfractionRepository extends JpaRepository<Infraction, Long> {

    List<Infraction> findByUser(User user);

    long countByUser(User user);

    List<Infraction> findByUserEmail(String email);

    List<Infraction> findAll();

    @Query("SELECT i FROM Infraction i WHERE i.date BETWEEN :startDate AND :endDate")
    List<Infraction> findInfractionsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
