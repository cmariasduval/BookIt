package com.example.bookit.Controllers;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Favorite;
import com.example.bookit.Entities.User;
import com.example.bookit.Service.FavoriteService;
import com.example.bookit.Service.UserService;
import com.example.bookit.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired private FavoriteService favoriteService;
    @Autowired private UserService userService;
    @Autowired private BookService bookService;

    @PostMapping("/add")
    public Favorite add(@RequestParam Long userId, @RequestParam Long bookId) {
        User user = userService.getUserById(userId);
        Book book = bookService.getBookById(bookId);
        return favoriteService.addFavorite(user, book);
    }

    @GetMapping("/list")
    public List<Favorite> list(@RequestParam Long userId) {
        User user = userService.getUserById(userId);
        return favoriteService.listFavorites(user);
    }

    @DeleteMapping("/remove/{favId}")
    public void remove(@PathVariable Long favId) {
        favoriteService.removeFavorite(favId);
    }
}
