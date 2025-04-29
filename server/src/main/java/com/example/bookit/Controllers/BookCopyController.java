package com.example.bookit.Controllers;

import com.example.bookit.Entities.BookCopy;
import com.example.bookit.Repository.BookCopyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/book-copies")
public class BookCopyController {

    @Autowired
    private BookCopyRepository bookCopyRepository;

    @PutMapping("/{id}/reserve")
    public ResponseEntity<?> reserveCopy(@PathVariable Long id) {
        Optional<BookCopy> optionalCopy = bookCopyRepository.findById(id);
        if (optionalCopy.isPresent()) {
            BookCopy copy = optionalCopy.get();
            if (!copy.isAvailable()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Already reserved");
            }
            copy.setAvailable(false);
            bookCopyRepository.save(copy);
            return ResponseEntity.ok(copy);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
