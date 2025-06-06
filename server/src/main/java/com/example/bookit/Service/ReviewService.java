package com.example.bookit.Service;

import com.example.bookit.Entities.Book;
import com.example.bookit.Entities.Review;
import com.example.bookit.Entities.User;
import com.example.bookit.Repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review createReview(User user, Book book, Integer rating, String comment) {
        if ((comment == null || comment.isBlank()) && rating == null) {
            throw new IllegalArgumentException("Debe enviar un comentario o una calificación");
        }

        Review review = new Review();
        review.setUser(user);
        review.setCreationDate(LocalDateTime.now());
        review.setBook(book);

        if (comment != null && !comment.isBlank()) {
            review.setComment(comment.trim());
        }

        if (rating != null) {
            review.setRating(rating);
        }

        return reviewRepository.save(review);
    }


    public List<Review> getReviewsByUser(User user) {
        return reviewRepository.findByUser(user);
    }

    public List<Review> getReviewsByBook(Book book) {
        return reviewRepository.findByBook(book);
    }

    public Review updateReview(Long id, int rating, String comment, User user) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review no encontrada"));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No podés editar esta review");
        }
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id, User user) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review no encontrada"));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("No podés eliminar esta review");
        }
        reviewRepository.delete(review);
    }

    public Object getReviewByUserAndBook(User user, Book book) {
        return reviewRepository.findByUserAndBook(user, book).orElse(null);

    }
}
