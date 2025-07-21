import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCarousel.css';

const BookCarousel = ({
                          books,
                          type,
                          onAction,
                          actionLabel,
                          showActionButton = true
                      }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const booksPerPage = 5;

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + booksPerPage >= books.length ? 0 : prev + booksPerPage
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? Math.max(0, books.length - booksPerPage) : Math.max(0, prev - booksPerPage)
        );
    };

    const handleBookClick = (bookId) => {
        navigate(`/bookDetails/${bookId}`);
    };

    const visibleBooks = books.slice(currentIndex, currentIndex + booksPerPage);
    const canGoNext = currentIndex + booksPerPage < books.length;
    const canGoPrev = currentIndex > 0;

    return (
        <div className="book-carousel">
            <div className="carousel-container">
                {canGoPrev && (
                    <button
                        className="carousel-nav prev"
                        onClick={prevSlide}
                        aria-label="Libros anteriores"
                    >
                        &#8249;
                    </button>
                )}

                <div className="carousel-content">
                    {visibleBooks.map((book) => (
                        <div key={book.id} className={`book-card ${type}`}>
                            <div
                                className="book-image-container"
                                onClick={() => handleBookClick(book.id)}
                            >
                                {book.imageUrl ? (
                                    <img
                                        src={book.imageUrl}
                                        alt={book.title}
                                        className="book-image"
                                    />
                                ) : (
                                    <div className="book-placeholder">
                                        <span>📚</span>
                                    </div>
                                )}
                                <div className="book-overlay">
                                    <p className="book-title">{book.title}</p>
                                    <p className="book-author">{book.author}</p>
                                </div>
                            </div>

                            {showActionButton && onAction && actionLabel && (
                                <div className="book-actions">
                                    <button
                                        className={`action-btn ${type}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAction(book.id);
                                        }}
                                    >
                                        {actionLabel}
                                    </button>
                                </div>
                            )}

                            {type === 'reserved' && book.reservationDetails && (
                                <div className="reservation-info">
                                    <small>
                                        Retiro: {new Date(book.reservationDetails.pickupDate).toLocaleDateString()}
                                    </small>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {canGoNext && (
                    <button
                        className="carousel-nav next"
                        onClick={nextSlide}
                        aria-label="Libros siguientes"
                    >
                        &#8250;
                    </button>
                )}
            </div>

            <div className="carousel-indicators">
                {Array.from({ length: Math.ceil(books.length / booksPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        className={`indicator ${index === Math.floor(currentIndex / booksPerPage) ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index * booksPerPage)}
                        aria-label={`Ir a página ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BookCarousel;