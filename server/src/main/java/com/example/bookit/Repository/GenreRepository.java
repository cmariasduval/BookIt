package com.example.bookit.Repository;

import com.example.bookit.Entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    public Optional<Genre> findByGenreType(String genreType);
}
