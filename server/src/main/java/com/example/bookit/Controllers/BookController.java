package com.example.bookit.Controllers;
import com.example.bookit.Config.JwtUtil;
import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:3000",
        allowedHeaders = {"Authorization", "Content-Type"},
        exposedHeaders = "Authorization")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/")
    public ResponseEntity<?> uploadBook(@RequestBody Book book) {
        String username = this.getAuthenticatedUser();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getRoleName().equals("admin"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only admin can upload books.");
        }

        book.setUploadedBy(user);
        bookRepository.save(book);

        return ResponseEntity.ok("Book uploaded by " + user.getUsername());
    }

    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();  // Nombre de usuario
        } else {
            return principal.toString();  // Si no es un UserDetails, retornar el principal (debería ser el nombre de usuario)
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(
            @RequestParam String query,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header("Location", "/")
                        .body(null);
            }

            String token = authorization.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .header("Location", "/")
                        .body(null);
            }

            String username = jwtUtil.extractUsername(token);
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            List<Book> books = bookRepository.findByTitle(query);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}