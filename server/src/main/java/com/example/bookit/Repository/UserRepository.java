package com.example.bookit.Repository;

import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    @Query("SELECT DISTINCT u FROM User u JOIN u.infractions i WHERE i.debt > 0")
    List<User> findUsersWithInfractions();
}
