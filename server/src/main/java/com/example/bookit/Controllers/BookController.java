package com.example.bookit.Controllers;
import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

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
}