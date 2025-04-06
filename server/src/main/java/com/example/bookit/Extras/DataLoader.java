package com.example.bookit.Extras;

import com.example.bookit.Entities.Genre;
import com.example.bookit.Repository.GenreRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataLoader {

    @Autowired
    private GenreRepository genreRepository;

    @PostConstruct
    public void init() {
        List<String> genres = List.of(
                "Psychology", "Historical", "Romance",
                "Sci-Fi", "Non-Fiction", "Horror",
                "Thriller", "Fantasy", "Mystery"
        );

        for (String name : genres) {
            if (genreRepository.findByGenreType(name).isEmpty()) {
                Genre genre = new Genre();
                genre.setGenreType(name);
                genreRepository.save(genre);
            }
        }
    }
}
