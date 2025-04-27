package com.example.bookit.Service;

import com.example.bookit.Entities.Book;
import com.example.bookit.Repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;  // Repositorio que interactúa con la base de datos

    /**
     * Busca libros por título que contengan la cadena de búsqueda.
     * @param query La cadena de búsqueda.
     * @return Una lista de libros que coinciden con la búsqueda.
     */
    public List<Book> searchBooks(String query) {
        // Busca libros cuyo título contenga la cadena 'query', sin importar mayúsculas/minúsculas
        return bookRepository.findByTitle(query);
    }
}
