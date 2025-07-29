package com.example.bookit.Controllers;

import com.example.bookit.Config.JwtUtil;
import com.example.bookit.DTO.AddBookRequest;
import com.example.bookit.DTO.BookDTO;
import com.example.bookit.DTO.BatchUploadResponse;
import com.example.bookit.DTO.BookBatchDTO;
import com.example.bookit.Entities.*;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Repository.FavoriteRepository;
import com.example.bookit.Repository.GenreRepository;
import com.example.bookit.Repository.UserRepository;
import com.example.bookit.Service.BookService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Keep for CSV, but not for JSON
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
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

    @Autowired
    private BookService bookService;

    @Autowired
    private FavoriteRepository favoriteRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Método existente para obtener los libros favoritos de un usuario
    public List<Book> getFavoriteBooks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Favorite> favorites = favoriteRepository.findByUser(user);

        return favorites.stream()
                .map(Favorite::getBook)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
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

        List<Genre> genres = addBookRequest.getGenres().stream()
                .map(name -> genreRepository.findByGenreType(name)
                        .orElseThrow(() -> new RuntimeException("Genre not found for: " + name))) // Added message
                .toList();

        String imagePath = addBookRequest.getImage();

        Book newBook = new Book(title, author, publisher, isbn, genres, imagePath, keywords, description);
        bookRepository.save(newBook);

        // Logic for copies moved to service/repository or within Book entity if applicable
        // For simplicity, assuming default copy setup or handled elsewhere
        // If you need to explicitly create copies here:
        if (copies > 0) {
            List<BookCopy> bookCopies = new ArrayList<>();
            for (int i = 0; i < copies; i++) {
                String copyId = "COPY-" + (i + 1) + "-" + newBook.getId(); // Make ID unique
                bookCopies.add(new BookCopy(newBook, copyId, true));
            }
            newBook.setCopies(bookCopies); // Assuming Book entity has setCopies
            bookRepository.save(newBook); // Save again to persist copies if not cascaded
        }


        return ResponseEntity.ok(newBook);
    }

    // CORRECTED: Endpoint para subida en lote desde JSON
    @PostMapping("/batch-upload/json")
    public ResponseEntity<BatchUploadResponse> uploadBooksFromJson(
            @RequestBody List<BookBatchDTO> bookDTOs) { // CHANGED FROM @RequestParam("file") MultipartFile file

        if (bookDTOs == null || bookDTOs.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new BatchUploadResponse(false, "La lista de libros está vacía o es nula", 0, 0, new ArrayList<>()));
        }

        try {
            BatchUploadResponse response = processBatchBooks(bookDTOs);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error procesando lote de libros JSON: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new BatchUploadResponse(false, "Error procesando el lote: " + e.getMessage(), 0, 0, new ArrayList<>()));
        }
    }

    // NUEVO: Endpoint para subida en lote desde CSV (remains as is, using MultipartFile)
    @PostMapping("/batch-upload/csv")
    public ResponseEntity<BatchUploadResponse> uploadBooksFromCsv(
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new BatchUploadResponse(false, "El archivo está vacío", 0, 0, new ArrayList<>()));
        }

        if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
            return ResponseEntity.badRequest()
                    .body(new BatchUploadResponse(false, "El archivo debe ser CSV", 0, 0, new ArrayList<>()));
        }

        try {
            List<BookBatchDTO> bookDTOs = parseCsvFile(file);
            BatchUploadResponse response = processBatchBooks(bookDTOs);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error procesando archivo CSV: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new BatchUploadResponse(false, "Error procesando archivo: " + e.getMessage(), 0, 0, new ArrayList<>()));
        }
    }

    // MÉTODO EXISTENTE: Método para procesar la lista de libros en lote
    private BatchUploadResponse processBatchBooks(List<BookBatchDTO> bookDTOs) {
        List<String> errors = new ArrayList<>();
        int successful = 0;
        int total = bookDTOs.size();

        for (int i = 0; i < bookDTOs.size(); i++) {
            try {
                BookBatchDTO bookDTO = bookDTOs.get(i);

                // Validar datos obligatorios
                if (bookDTO.getTitle() == null || bookDTO.getTitle().trim().isEmpty()) {
                    errors.add("Fila " + (i + 1) + ": El título es obligatorio");
                    continue;
                }

                if (bookDTO.getAuthor() == null || bookDTO.getAuthor().trim().isEmpty()) {
                    errors.add("Fila " + (i + 1) + ": El autor es obligatorio");
                    continue;
                }

                // Verificar si el libro ya existe (por ISBN si está presente)
                if (bookDTO.getIsbn() != null && !bookDTO.getIsbn().trim().isEmpty()) {
                    Optional<Book> existingBook = bookRepository.findByIsbn(bookDTO.getIsbn().trim());
                    if (existingBook.isPresent()) {
                        errors.add("Fila " + (i + 1) + ": Ya existe un libro con ISBN " + bookDTO.getIsbn());
                        continue;
                    }
                }

                // Procesar géneros
                List<Genre> genres = new ArrayList<>();
                if (bookDTO.getGenres() != null && !bookDTO.getGenres().isEmpty()) {
                    for (String genreName : bookDTO.getGenres()) {
                        Optional<Genre> genre = genreRepository.findByGenreType(genreName.trim());
                        if (genre.isPresent()) {
                            genres.add(genre.get());
                        } else {
                            // Crear género si no existe
                            Genre newGenre = new Genre();
                            newGenre.setGenreType(genreName.trim());
                            genreRepository.save(newGenre);
                            genres.add(newGenre);
                        }
                    }
                }

                // Crear el libro
                Book newBook = new Book(
                        bookDTO.getTitle().trim(),
                        bookDTO.getAuthor().trim(),
                        bookDTO.getPublisher() != null ? bookDTO.getPublisher().trim() : "",
                        bookDTO.getIsbn() != null ? bookDTO.getIsbn().trim() : "",
                        genres,
                        bookDTO.getImageUrl() != null ? bookDTO.getImageUrl().trim() : "",
                        bookDTO.getKeywords() != null ? bookDTO.getKeywords().trim() : "",
                        bookDTO.getDescription() != null ? bookDTO.getDescription().trim() : ""
                );

                // Crear copias si se especifican
                if (bookDTO.getCopies() != null && bookDTO.getCopies() > 0) {
                    List<BookCopy> bookCopies = new ArrayList<>();
                    for (int j = 0; j < bookDTO.getCopies(); j++) {
                        String copyId = "COPY-" + (j + 1) + "-" + UUID.randomUUID().toString().substring(0, 8); // Unique ID for each copy
                        bookCopies.add(new BookCopy(newBook, copyId, true));
                    }
                    newBook.setCopies(bookCopies);
                } else {
                    // Default to 1 copy if not specified or invalid
                    List<BookCopy> bookCopies = new ArrayList<>();
                    String copyId = "COPY-1-" + UUID.randomUUID().toString().substring(0, 8);
                    bookCopies.add(new BookCopy(newBook, copyId, true));
                    newBook.setCopies(bookCopies);
                }


                bookRepository.save(newBook);
                successful++;

            } catch (Exception e) {
                errors.add("Fila " + (i + 1) + ": Error procesando libro - " + e.getMessage());
            }
        }

        boolean success = successful > 0;
        String message = successful + " libros subidos correctamente de " + total + " total.";
        if (!errors.isEmpty()) {
            message += " " + errors.size() + " errores encontrados.";
        }

        return new BatchUploadResponse(success, message, successful, total, errors);
    }

    // MÉTODO EXISTENTE: Método para parsear archivo CSV
    private List<BookBatchDTO> parseCsvFile(MultipartFile file) throws IOException {
        List<BookBatchDTO> books = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line = reader.readLine(); // Leer cabecera
            if (line == null) {
                throw new IOException("El archivo CSV está vacío");
            }

            // Mapear las columnas (asumiendo un orden específico)
            // title,author,isbn,publisher,description,keywords,imageUrl,genres,copies
            while ((line = reader.readLine()) != null) {
                String[] values = parseCSVLine(line);

                if (values.length < 2) { // Al menos título y autor
                    continue; // Saltar filas incompletas
                }

                BookBatchDTO book = new BookBatchDTO();
                book.setTitle(getValueOrNull(values, 0));
                book.setAuthor(getValueOrNull(values, 1));
                book.setIsbn(getValueOrNull(values, 2));
                book.setPublisher(getValueOrNull(values, 3));
                book.setDescription(getValueOrNull(values, 4));
                book.setKeywords(getValueOrNull(values, 5));
                book.setImageUrl(getValueOrNull(values, 6));

                // Procesar géneros (separados por ;)
                String genresStr = getValueOrNull(values, 7);
                if (genresStr != null && !genresStr.trim().isEmpty()) {
                    List<String> genres = Arrays.stream(genresStr.split(";"))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .collect(Collectors.toList());
                    book.setGenres(genres);
                }

                // Procesar número de copias
                String copiesStr = getValueOrNull(values, 8);
                if (copiesStr != null && !copiesStr.trim().isEmpty()) {
                    try {
                        book.setCopies(Integer.parseInt(copiesStr.trim()));
                    } catch (NumberFormatException e) {
                        book.setCopies(1); // Valor por defecto
                    }
                } else {
                    book.setCopies(1);
                }

                books.add(book);
            }
        }

        return books;
    }

    // Método auxiliar para parsear líneas CSV (maneja comillas y comas)
    private String[] parseCSVLine(String line) {
        List<String> result = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder currentField = new StringBuilder();

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                result.add(currentField.toString());
                currentField.setLength(0);
            } else {
                currentField.append(c);
            }
        }

        result.add(currentField.toString());
        return result.toArray(new String[0]);
    }

    // Método auxiliar para obtener valor de array o null
    private String getValueOrNull(String[] values, int index) {
        if (index < values.length && values[index] != null) {
            String value = values[index].trim();
            return value.isEmpty() ? null : value;
        }
        return null;
    }

    // Métodos existentes...
    @PutMapping("/edit/{id}")
    public ResponseEntity<Book> editBook(
            @PathVariable Long id,
            @ModelAttribute AddBookRequest editBookRequest
    ) throws IOException {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        existingBook.setTitle(editBookRequest.getTitle());
        existingBook.setAuthor(editBookRequest.getAuthor());
        existingBook.setIsbn(editBookRequest.getIsbn());
        existingBook.setPublisher(editBookRequest.getPublisher());
        existingBook.setDescription(editBookRequest.getDescription());
        existingBook.setKeywords(editBookRequest.getKeywords());

        List<Genre> genres = editBookRequest.getGenres().stream()
                .map(name -> genreRepository.findByGenreType(name)
                        .orElseThrow(() -> new RuntimeException("Genre not found")))
                .collect(Collectors.toList());
        existingBook.setGenres(genres);

        // Logic for copies in edit method. Re-evaluating this based on your BookCopy entity structure
        // If copies are managed as a collection within Book, you might need to fetch existing copies
        // and update them or clear/re-add. This simplified version replaces them.
        int copies = editBookRequest.getCopies();
        List<BookCopy> bookCopies = new ArrayList<>();
        for (int i = 0; i < copies; i++) {
            String copyId = "COPY-" + (i + 1) + "-" + existingBook.getId(); // Ensure unique ID for copies
            bookCopies.add(new BookCopy(existingBook, copyId, true));
        }
        existingBook.setCopies(bookCopies);

        String newImageUrl = editBookRequest.getImage();
        if (newImageUrl != null && !newImageUrl.isEmpty()) {
            existingBook.setImagePath(newImageUrl);
        }

        Book updatedBook = bookRepository.save(existingBook);
        return ResponseEntity.ok(updatedBook);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Book>> searchBooks(@RequestParam String query) {
        System.out.println("🔍 Entró al endpoint /search con query: " + query);
        try {
            List<Book> books = bookRepository.searchBooks(query);
            System.out.println("📚 Libros encontrados: " + books.size());

            if (books.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            return ResponseEntity.ok(books);  // ⬅️ devolvés directamente las entidades Book
        } catch (Exception e) {
            System.out.println("❌ Error en searchBooks: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookService.findById(id);
        return ResponseEntity.ok(book);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replaceFirst("Bearer ", "");
        String usernameFromToken = jwtUtil.extractUsername(token);

        Optional<User> userOptional = userRepository.findByUsername(usernameFromToken);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado.");
        }

        User user = userOptional.get();
        List<Genre> interests = user.getInterests();

        if (interests.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<String> genreNames = interests.stream()
                .map(Genre::getGenreType)
                .toList();

        List<Book> recommendedBooks = bookRepository.findBooksByGenres(genreNames);
        return ResponseEntity.ok(recommendedBooks);
    }

    @GetMapping("/genre/{genreName}")
    public ResponseEntity<List<Book>> getBooksByGenre(@PathVariable String genreName) {
        List<Book> books = bookRepository.findByGenres_GenreTypeIgnoreCase(genreName);
        if (books.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(books);
    }

    @GetMapping("/all")
    public ResponseEntity<Page<Book>> getAllBooksPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(defaultValue = "title") String sort
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(sort));
        Page<Book> booksPage = bookRepository.findAll(pageable);
        return ResponseEntity.ok(booksPage);
    }

    @GetMapping("/genres")
    public ResponseEntity<List<Genre>> getAllGenres() {
        List<Genre> genres = genreRepository.findAll();
        if (genres.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(genres);
    }
}