package com.example.bookit.Service;

import com.example.bookit.DTO.BookDTO;
import com.example.bookit.Entities.*;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.FavoriteRepository;
import com.example.bookit.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

//    // Ajustamos la firma del método para que coincida con los parámetros enviados desde el controlador
//    public Book addOrUpdateBook(String title, String author, String publisher, String isbn,
//                                MultipartFile image, List<String> genres, String keywords,
//                                String description, String username) throws IOException {
//
//        // Buscar al usuario autenticado
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Buscar si el libro ya existe (por ISBN)
//        Book book = bookRepository.findByIsbn(isbn).orElse(null);
//
//        if (book == null) {
//            // Si el libro no existe, crear uno nuevo
//            List<Genre> genreObjects = genres.stream()
//                    .map(genreName -> new Genre(genreName))
//                    .collect(Collectors.toList());
//
//            book = new Book(title, author, publisher, isbn, genreObjects, image != null && !image.isEmpty() ? saveImage(image) : null, keywords, description);
//        } else {
//            // Si el libro ya existe, actualizar sus detalles
//            book.setTitle(title);
//            book.setAuthor(author);
//            book.setPublisher(publisher);
//            book.setDescription(description);
//            book.setKeywords(keywords);
//            if (image != null && !image.isEmpty()) {
//                String imagePath = saveImage(image);
//                book.setImageUrl(imagePath);
//            }
//        }
//
//        book.setUploadedBy(user);
//        return bookRepository.save(book);
//    }

    // Método para guardar la imagen en el servidor
    private String saveImage(MultipartFile image) throws IOException {
        Path path = Paths.get("uploads/images");
        Files.createDirectories(path);
        String fileName = image.getOriginalFilename();
        Path filePath = path.resolve(fileName);
        image.transferTo(filePath);
        return filePath.toString();
    }

    /**
     * Devuelve todos los libros de la base de datos.
     */
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    /**
     * Devuelve un libro por su ID.
     */
    public Book getBookById(Long bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
    }

    public List<Book> searchBooksByTitle(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return bookRepository.findAll();
        }

        // Busca libros que contengan el término en el título (case insensitive)
        return bookRepository.findByTitleContainingIgnoreCase(searchTerm.trim());
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
    }

    public List<Book> getFavoriteBooks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Encuentra todos los favoritos asociados al usuario
        List<Favorite> favorites = favoriteRepository.findByUser(user);

        // Mapea la lista de favoritos a una lista de libros
        return favorites.stream()
                .map(Favorite::getBook)  // Mapea cada Favorite a su libro
                .collect(Collectors.toList());

    }

    public Book addOrUpdateBook(String title, String author, String publisher, String isbn,
                                MultipartFile image, List<String> genres, String keywords,
                                String description, String username) throws IOException {

        // Buscar al usuario autenticado
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Buscar si el libro ya existe (por ISBN)
        Book book = bookRepository.findByIsbn(isbn).orElse(null);

        if (book == null) {
            // Si el libro no existe, crear uno nuevo
            List<Genre> genreObjects = genres.stream()
                    .map(Genre::new)
                    .collect(Collectors.toList());

            book = new Book(title, author, publisher, isbn,
                    genreObjects,
                    image != null && !image.isEmpty() ? saveImage(image) : null,
                    keywords, description);

            // ✅ Crear copias nuevas (por ejemplo, 5 copias)
            List<BookCopy> copies = new java.util.ArrayList<>();
            for (int i = 1; i <= 5; i++) {
                String copyId = isbn + "-C" + i;
                BookCopy copy = new BookCopy(book, copyId, true);
                copies.add(copy);
            }
            book.setCopies(copies);

        } else {
            // Si el libro ya existe, actualizar sus detalles
            book.setTitle(title);
            book.setAuthor(author);
            book.setPublisher(publisher);
            book.setDescription(description);
            book.setKeywords(keywords);

            if (image != null && !image.isEmpty()) {
                String imagePath = saveImage(image);
                book.setImageUrl(imagePath);
            }
        }

        book.setUploadedBy(user);
        return bookRepository.save(book);
    }


    public List<BookDTO> findBooksByGenre(String genreName) {
        // Asumiendo que tienes una entidad Book con un campo "genre" (String o entidad Genre)
        List<Book> books = bookRepository.findBooksByGenre(genreName);
        return books.stream()
                .map(book -> new BookDTO(book))
                .collect(Collectors.toList());
    }
}
