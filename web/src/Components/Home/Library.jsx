import React, { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/books')
            .then(response => response.json())
            .then(data => {
                setAllBooks(data);
                const read = data.filter(book => book.status === 'read');
                const reserved = data.filter(book => book.status === 'reserved');
                setReadBooks(read);
                setReservedBooks(reserved);
            })
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    const handleReserveBook = (bookId) => {
        // Lógica para reservar el libro, por ejemplo, hacer un PUT o POST para actualizar el estado
        console.log(`Libro con ID ${bookId} reservado`);
        // Aquí podrías hacer una solicitud a la API para cambiar el estado del libro a 'reserved'
    };

    return (
        <div className="library-container">
            <h1>Biblioteca</h1>

            {/* Sección de Todos los Libros */}
            <div className="book-section">
                <h2>Todos los Libros</h2>
                <ul>
                    {allBooks.length > 0 ? (
                        allBooks.map(book => (
                            <li key={book.id}>
                                <h3>{book.title}</h3>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros disponibles</p>
                    )}
                </ul>
            </div>

            {/* Sección de Libros Leídos */}
            <div className="book-section">
                <h2>Libros Leídos</h2>
                <ul>
                    {readBooks.length > 0 ? (
                        readBooks.map(book => (
                            <li key={book.id}>
                                <h3>{book.title}</h3>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros leídos</p>
                    )}
                </ul>
            </div>

            {/* Sección de Libros Reservados */}
            <div className="book-section">
                <h2>Libros Reservados</h2>
                <ul>
                    {reservedBooks.length > 0 ? (
                        reservedBooks.map(book => (
                            <li key={book.id}>
                                <h3>{book.title}</h3>
                                <button onClick={() => handleReserveBook(book.id)}>
                                    Reservar
                                </button>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros reservados</p>
                    )}
                </ul>
            </div>

        </div>
    );
};

export default Library;
