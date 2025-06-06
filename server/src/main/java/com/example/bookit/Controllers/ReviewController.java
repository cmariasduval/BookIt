package com.example.bookit.Controllers;

import com.example.bookit.DTO.ReviewRequest;
import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Review;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.BookRepository;
import com.example.bookit.Service.ReviewService;
import com.example.bookit.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final BookRepository bookRepository;
    private final UserService userService;

    public ReviewController(ReviewService reviewService, BookRepository bookRepository, UserService userService) {
        this.reviewService = reviewService;
        this.bookRepository = bookRepository;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        User user = userService.findByUsername(getAuthenticatedUsername());
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        return ResponseEntity.ok(reviewService.createReview(user, book, request.getRating(), request.getComment()));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Review>> getMyReviews() {
        User user = userService.findByUsername(getAuthenticatedUsername());
        return ResponseEntity.ok(reviewService.getReviewsByUser(user));
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Review>> getReviewsForBook(@PathVariable Long bookId) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        return ResponseEntity.ok(reviewService.getReviewsByBook(book));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReviewRequest request) {
        User user = userService.findByUsername(getAuthenticatedUsername());
        return ResponseEntity.ok(reviewService.updateReview(reviewId, request.getRating(), request.getComment(), user));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        User user = userService.findByUsername(getAuthenticatedUsername());
        reviewService.deleteReview(reviewId, user);
        return ResponseEntity.ok().build();
    }

    private String getAuthenticatedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    @GetMapping("/me/{bookId}")
    public ResponseEntity<?> getMyReviewForBook(@PathVariable Long bookId) {
        User user = userService.findByUsername(getAuthenticatedUsername());
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));

        return ResponseEntity.ok(reviewService.getReviewByUserAndBook(user, book));
    }


}
