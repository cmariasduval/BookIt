package com.example.bookit.Controllers;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Read;
import com.example.bookit.Entities.User;
import com.example.bookit.Service.BookService;
import com.example.bookit.Service.ReadService;
import com.example.bookit.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/read")
public class ReadController {

    @Autowired private ReadService readService;
    @Autowired private UserService userService;
    @Autowired private BookService bookService;

    @PostMapping("/mark")
    public Read markAsRead(@RequestParam Long userId, @RequestParam Long bookId) {
        User user = userService.getUserById(userId);
        Book book = bookService.getBookById(bookId);
        return readService.markAsRead(user, book);
    }

    @GetMapping("/list")
    public List<Read> list(@RequestParam Long userId) {
        User user = userService.getUserById(userId);
        return readService.listRead(user);
    }

    @DeleteMapping("/unmark/{readId}")
    public void unmark(@PathVariable Long readId) {
        readService.unmarkAsRead(readId);
    }
}
