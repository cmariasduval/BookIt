package com.example.bookit.DTO;

import com.example.bookit.Entities.Review;
import com.example.bookit.Entities.User;

public class ReviewDTO {
    private Long id;
    private int rating;
    private String comment;
    private String bookTitle;
    private Long bookId;
    private User user;

    public ReviewDTO(Review review) {
        this.id = review.getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.bookTitle = review.getBook() != null ? review.getBook().getTitle() : null;
        this.bookId = review.getBook() != null ? review.getBook().getId() : null;
        this.user = review.getUser() != null ? review.getUser() : null;
    }

    // getters y setters
    public Long getId() { return id; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public String getBookTitle() { return bookTitle; }
    public Long getBookId() { return bookId; }
    public User getUser() { return user; }
}
