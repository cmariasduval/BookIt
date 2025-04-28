package com.example.bookit.Service;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.User;
import com.example.bookit.Entities.Genre;  // Asegúrate de tener importada la entidad Genre
import com.example.bookit.Repository.BookRepository;
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

    // Ajustamos la firma del metodo para que coincida con los parámetros enviados desde el controlador
    public Book addOrUpdateBook(String title, String author, String publisher, String isbn,
                                MultipartFile image, List<String> genres, String keywords,
                                String description, String username) throws IOException {

        // Buscar al usuario autenticado
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        // Buscar si el libro ya existe (por ISBN)
        Book book = bookRepository.findByIsbn(isbn).orElse(null);  // O manejar con orElseThrow si prefieres lanzar una excepción

        if (book == null) {
            // Si el libro no existe, crear uno nuevo
            // Convertir los géneros (List<String>) a objetos Genre
            List<Genre> genreObjects = genres.stream()
                    .map(genreName -> new Genre(genreName))  // Suponiendo que el constructor de Genre acepta el nombre como parámetro
                    .collect(Collectors.toList());

            book = new Book();
        } else {
            // Si el libro ya existe, actualizar sus detalles
            book.setTitle(title);
            book.setAuthor(author);
            book.setPublisher(publisher);
            book.setDescription(description);
            book.setKeywords(keywords);
            // Actualizar la imagen si es necesario
            if (image != null && !image.isEmpty()) {
                String imagePath = saveImage(image);  // Guardar la imagen en el servidor
                book.setImageUrl(imagePath);  // Establecer la ruta de la imagen
            }
        }

        // Asociar el libro al usuario autenticado
        book.setUploadedBy(user);

        // Guardar el libro (si es nuevo o actualizado)
        return bookRepository.save(book);
    }

    // Método para guardar la imagen en el servidor
    private String saveImage(MultipartFile image) throws IOException {
        // Crear un directorio donde se guardarán las imágenes (puedes configurarlo en un archivo de configuración)
        Path path = Paths.get("uploads/images");
        Files.createDirectories(path);  // Asegurarse de que el directorio exista

        // Guardar la imagen en el servidor
        String fileName = image.getOriginalFilename();
        Path filePath = path.resolve(fileName);
        image.transferTo(filePath);

        return filePath.toString();  // Retorna la ruta de la imagen guardada
    }
}
