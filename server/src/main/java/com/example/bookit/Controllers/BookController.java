package com.example.bookit.Controllers;
import com.example.bookit.Entities.Book;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addBook(@RequestBody Book book) {
        // Obtener el usuario autenticado
        String username = getAuthenticatedUser();

        // Aquí, podrías agregar lógica adicional para verificar si el usuario tiene permisos para agregar libros

        // Guardar el libro en la base de datos
        bookRepository.save(book);
        return ResponseEntity.ok("Book added successfully.");
    }

    // Método auxiliar para obtener el nombre del usuario autenticado
    private String getAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();  // Nombre de usuario
        } else {
            return principal.toString();  // Si no es un UserDetails, retornar el principal (debería ser el nombre de usuario)
        }
    }
}
