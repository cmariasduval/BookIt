package com.example.bookit.Repository;

import com.example.bookit.Entities.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {


    Optional<Book> findByIsbn(String isbn);

    List<Book> findByTitleContainingIgnoreCase(String title);

    @EntityGraph(attributePaths = {"imageUrl"})
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN b.genres g " +
            "WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(b.author) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Book> searchBooks(@Param("query") String query);


    @Query("SELECT DISTINCT b FROM Book b JOIN b.genres g WHERE g.genreType IN :genres")
    List<Book> findBooksByGenres(@Param("genres") List<String> genres);

    @Query("SELECT DISTINCT b FROM Book b JOIN b.genres g WHERE g.genreType IN :genres")
    List<Book> findBooksByGenre(@Param("genres") String genre);

    List<Book> findByGenres_GenreTypeIgnoreCase(String genreType);



}
