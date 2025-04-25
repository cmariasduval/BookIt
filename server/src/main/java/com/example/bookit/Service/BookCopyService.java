package com.example.bookit.Service;

import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Repository.BookCopyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BookCopyService {

    @Autowired
    private BookCopyRepository bookCopyRepository;  // Acceso al repositorio de BookCopy

    public BookCopy getBookCopyById(Long copyId) {
        Optional<BookCopy> bookCopy = bookCopyRepository.findById(copyId);
        return bookCopy.orElse(null);  // Devuelve el BookCopy o null si no se encuentra
    }
}
