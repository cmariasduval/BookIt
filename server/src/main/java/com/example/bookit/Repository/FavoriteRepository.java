package com.example.bookit.Repository;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Favorite;
import com.example.bookit.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findAllByUser(User user);

    Favorite findByUserAndBook(User user, Book book);

    List<Favorite> findByUser(User user);
}
