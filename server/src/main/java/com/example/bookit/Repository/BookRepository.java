package com.example.bookit.Repository;

import com.example.bookit.Entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {


    Optional<Book> findByIsbn(String isbn);
}
