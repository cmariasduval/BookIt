package com.example.bookit.Repository;

import com.example.bookit.Entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {


    Optional<Book> findByIsbn(String isbn);

    List<Book> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN b.genres g " +
            "WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(g.genreType) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);

}
