package com.example.bookit.Repository;

import com.example.bookit.Entities.Infraction;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfractionRepository extends JpaRepository<Infraction, Long> {

    List<Infraction> findByUser(User user);

    long countByUser(User user);

    List<Infraction> findByUserEmail(String email);

    List<Infraction> findAll();

}
