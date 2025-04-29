package com.example.bookit.Controllers;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Favorite;
import com.example.bookit.Entities.User;
import com.example.bookit.Service.FavoriteService;
import com.example.bookit.Service.UserService;
import com.example.bookit.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")

public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;
    @Autowired
    private UserService userService;
    @Autowired
    private BookService bookService;

    @PostMapping("/add")
    public Favorite add(@RequestParam Long bookId) {

        User user = userService.getUserByName(getAuthenticatedUser());
        Book book = bookService.getBookById(bookId);
        return favoriteService.addFavorite(user, book);
    }

    @GetMapping("/list")
    public List<Favorite> list(@RequestParam Long userId) {
        User user = userService.getUserById(userId);
        return favoriteService.listFavorites(user);
    }

    @DeleteMapping("/remove")
    public void removeFavorite(@RequestParam Long bookId) {
        // Obtiene el usuario autenticado
        User user = userService.getUserByName(getAuthenticatedUser());

        // Obtiene el libro con el ID proporcionado
        Book book = bookService.getBookById(bookId);

        // Llama al servicio para eliminarlo de los favoritos
        favoriteService.removeFavorite(user, book);
    }

    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @GetMapping
    public List<Book> getFavoriteBooks() {
        return bookService.getFavoriteBooks(getAuthenticatedUser());
    }
}
