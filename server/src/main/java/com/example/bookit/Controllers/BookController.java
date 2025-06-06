package com.example.bookit.Controllers;

import com.example.bookit.Config.JwtUtil;
import com.example.bookit.DTO.AddBookRequest;
import com.example.bookit.DTO.BookDTO;
import com.example.bookit.Entities.*;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.FavoriteRepository;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:3000")
public class BookController {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private GenreRepository genreRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired private BookService bookService;

    @Autowired
    private FavoriteRepository favoriteRepository;

    // Metodo para obtener los libros favoritos de un usuario
    public List<Book> getFavoriteBooks(String username) {
        // Recupera el usuario por su nombre
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Encuentra todos los favoritos asociados al usuario
        List<Favorite> favorites = favoriteRepository.findByUser(user);

        // Devuelve la lista de libros favoritos
        return favorites.stream()
                .map(Favorite::getBook)  // Mapea cada Favorite a su libro
                .collect(Collectors.toList()); // Colecciona los libros en una lista
    }

    // Devuelve todos los libros
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }

    // Metodo para guardar la imagen en el sistema de archivos y obtener su ruta
//    private String saveImage(String imageUrl) throws IOException {
//        // Define la carpeta de destino donde se almacenarán las imágenes
//        Path uploadDir = Paths.get("uploads");
//        if (!Files.exists(uploadDir)) {
//            Files.createDirectories(uploadDir);  // Crea la carpeta "uploads" si no existe
//        }
//
//        // Obtiene el nombre original del archivo
//        String imageName = imageUrl.getOriginalFilename();
//        Path filePath = uploadDir.resolve(imageName);
//
//        // Guarda el archivo en el sistema de archivos
//        Files.copy(imageUrl.getInputStream(), filePath);
//
//        return filePath.toString();  // Retorna la ruta del archivo guardado
//    }

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
        //MultipartFile image = addBookRequest.getImage();  // Obtiene el archivo de imagen
        //String imageUrl = addBookRequest.getImage();
        List<Genre> genres = addBookRequest.getGenres().stream().map(name -> genreRepository.findByGenreType(name).orElseThrow(() -> new RuntimeException())).toList();
        // Guarda la imagen y obtiene la ruta del archivo
        //String imagePath = saveImage(imageUrl);
        String imagePath = addBookRequest.getImage(); // ya es la URL


        // Crea un nuevo libro con los datos recibidos
        Book newBook = new Book(title, author, publisher, isbn, genres, imagePath, keywords, description);

        // Guarda el libro en la base de datos
        bookRepository.save(newBook);

        // Devuelve el libro creado como respuesta
        return ResponseEntity.ok(newBook);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<Book> editBook(
            @PathVariable Long id,
            @ModelAttribute AddBookRequest editBookRequest
    ) throws IOException {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Actualizamos los atributos del libro
        existingBook.setTitle(editBookRequest.getTitle());
        existingBook.setAuthor(editBookRequest.getAuthor());
        existingBook.setIsbn(editBookRequest.getIsbn());
        existingBook.setPublisher(editBookRequest.getPublisher());
        existingBook.setDescription(editBookRequest.getDescription());
        existingBook.setKeywords(editBookRequest.getKeywords());

        // Actualizar géneros
        List<Genre> genres = editBookRequest.getGenres().stream()
                .map(name -> genreRepository.findByGenreType(name)
                        .orElseThrow(() -> new RuntimeException("Genre not found")))
                .collect(Collectors.toList());
        existingBook.setGenres(genres);

        // Actualizar copias
        int copies = editBookRequest.getCopies();
        List<BookCopy> bookCopies = new ArrayList<>();
        for (int i = 0; i < copies; i++) {
            String copyId = "COPY-" + (i + 1);  // Generar un ID único para cada copia
            bookCopies.add(new BookCopy(existingBook, copyId, true));  // Todas las copias disponibles
        }
        existingBook.setCopies(bookCopies);  // Establecer las copias al libro

        // Si se adjunta una nueva imagen, reemplazar la anterior
        String newImageUrl = editBookRequest.getImage();
        if (newImageUrl != null && !newImageUrl.isEmpty()) {
            existingBook.setImagePath(newImageUrl);
        }

        // Guardar los cambios en la base de datos
        Book updatedBook = bookRepository.save(existingBook);
        return ResponseEntity.ok(updatedBook);
    }




    @GetMapping("/search")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam String query) {
        System.out.println("🔍 Entró al endpoint /search con query: " + query);
        try {
            List<Book> books = bookRepository.findByTitleContainingIgnoreCase(query);
            System.out.println("📚 Libros encontrados: " + books.size());

            if (books.isEmpty()) {
                System.out.println("⚠️ No se encontraron libros.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Convertir a DTO si estás usando DTOs
            List<BookDTO> dtos = books.stream()
                    .map(book -> new BookDTO(book.getId(), book.getTitle(), book.getAuthor(), book.getImage()))
                    .toList();

            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            System.out.println("❌ Error en searchBooks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }




    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return ResponseEntity.ok(book);
    }
}
