package com.example.bookit.Repository;

import com.example.bookit.DTO.BookDTO;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    @Query("""
    SELECT DISTINCT u
    FROM User u
    LEFT JOIN u.infractions i
    WHERE (i.debt > 0) OR (u.blocked = true)
""")
    List<User> findUsersWithInfractionsOrBlocked();

    @Query("SELECT DISTINCT u FROM User u JOIN u.infractions i WHERE i.paid = false")
    List<User> findUsersWithDebtPending();

    @Query("SELECT r.copy.book FROM Reservation r WHERE r.user.email = :email")
    List<BookDTO> findReservedBooksByUserEmail(@Param("email") String email);

}
