import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams(); // capturamos el id de la URL
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/books/{id}`);
        if (!response.ok) {
          throw new Error('Error fetching book');
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;  // loader mientras carga
  }

  if (error) {
    return <div>{error}</div>; // mensaje si hay error
  }

  if (!book) {
    return <div>Book not found</div>; // por si no lo encuentra
  }

  return (
    <div className="bookdetail-container">
      <div className="left-section">
        <img src={book.coverImage} alt={book.title} className="book-image" />
      </div>
      <div className="right-section">
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">{book.author}</p>
        <p className="book-publisher">{book.publisher}</p>
        <div className="book-genres">
          {book.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
        <p className="book-synopsis">{book.synopsis}</p>
        <p className="book-copies">Copies available: {book.copies}</p>
        <p className={`book-status ${book.status === "Available" ? "available" : "unavailable"}`}>
          {book.status}
        </p>
      </div>
    </div>
  );
};

export default BookDetails;
