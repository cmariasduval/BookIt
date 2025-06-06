package com.example.bookit.Repository;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Review;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBook(Book book);
    List<Review> findByUser(User user);
    Optional<Object> findByUserAndBook(User user, Book book);
}
