package com.example.bookit.Controllers;

import com.example.bookit.DTO.AddBookRequest;
import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Genre;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private BookService bookService;

    // Metodo para guardar la imagen en el sistema de archivos y obtener su ruta
    private String saveImage(MultipartFile image) throws IOException {
        // Define la carpeta de destino donde se almacenarán las imágenes
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);  // Crea la carpeta "uploads" si no existe
        }

        // Obtiene el nombre original del archivo
        String imageName = image.getOriginalFilename();
        Path filePath = uploadDir.resolve(imageName);

        // Guarda el archivo en el sistema de archivos
        Files.copy(image.getInputStream(), filePath);

        return filePath.toString();  // Retorna la ruta del archivo guardado
    }

    @PostMapping("/addBook")
    public ResponseEntity<Book> addBook(@ModelAttribute AddBookRequest addBookRequest) throws IOException {
        System.out.println(addBookRequest);
        String title = addBookRequest.getTitle();
        String author = addBookRequest.getAuthor();
        String isbn = addBookRequest.getIsbn();
        String publisher = addBookRequest.getPublisher();
        String description = addBookRequest.getDescription();
        String keywords = addBookRequest.getKeywords();
        int copies = addBookRequest.getCopies();
        MultipartFile image = addBookRequest.getImage();  // Obtiene el archivo de imagen
        List<Genre> genres = addBookRequest.getGenres();

        // Guarda la imagen y obtiene la ruta del archivo
        String imagePath = saveImage(image);

        // Crea un nuevo libro con los datos recibidos
        Book newBook = new Book(title, author, publisher, isbn, genres, imagePath, keywords, description);

        // Guarda el libro en la base de datos
        bookRepository.save(newBook);

        // Devuelve el libro creado como respuesta
        return ResponseEntity.ok(newBook);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam(required = false) String term) {
        List<Book> books = bookService.searchBooksByTitle(term);

        if (books.isEmpty()) {
            return ResponseEntity.noContent().build(); // No hay resultados
        }

        return ResponseEntity.ok(books); // Retornar los libros encontrados
    }
}
