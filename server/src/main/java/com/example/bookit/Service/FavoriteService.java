package com.example.bookit.Service;

import com.example.bookit.Entities.Favorite;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Book;
import com.example.bookit.Repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    public Favorite addFavorite(User user, Book book) {
        Favorite favorite = new Favorite(user, book);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long favoriteId) {
        favoriteRepository.deleteById(favoriteId);
    }

    public List<Favorite> listFavorites(User user) {
        return favoriteRepository.findAllByUser(user);
    }
}
