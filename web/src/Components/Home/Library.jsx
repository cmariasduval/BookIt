import React, { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    return (
        <div className="library-container">
            <h1>Biblioteca</h1>
            <div className="book-grid">
                {books.map(book => (
                    <div key={book.id} className="book-card">
                        <img
                            src={book.imageUrl}
                            alt={book.title}
                            className="book-image"
                        />
                        <h3>{book.title}</h3>
                        <p><strong>Autor:</strong> {book.author}</p>
                        <p><strong>Editorial:</strong> {book.publisher}</p>
                        <p><strong>ISBN:</strong> {book.ISBN}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;
