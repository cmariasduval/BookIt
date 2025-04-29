import React, { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.error("Token no encontrado");
            setError("Token no encontrado");
            return;
        }

        fetch('http://localhost:8080/api/books', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                return response.json();
            })
            .then(data => {
                setAllBooks(data);
                setReadBooks(data.filter(book => book.status === 'read'));
                setReservedBooks(data.filter(book => book.status === 'reserved'));
            })
            .catch(err => {
                console.error('Error fetching books:', err);
                setError("Error al obtener los libros. Intenta de nuevo más tarde.");
            });
    }, []);

    const handleReserveBook = (bookId) => {
        console.log(`Reservando libro ID ${bookId}`);
        // Aquí iría la llamada a la API para reservar
    };

    const handleFavoriteBook = (bookId) => {
        console.log(`Marcando como favorito libro ID ${bookId}`);
        setFavoriteBooks(prev => {
            if (prev.includes(bookId)) return prev;
            return [...prev, bookId];
        });
    };

    const handleMarkAsRead = (bookId) => {
        console.log(`Marcando como leído libro ID ${bookId}`);
        setReadBooks(prev => prev.includes(bookId) ? prev : [...prev, bookId]);
        // Opcional: actualizar allBooks status a 'read'
        setAllBooks(prev => prev.map(book => book.id === bookId ? { ...book, status: 'read' } : book));
    };

    return (
        <div className="library-container">
            <h1>Biblioteca</h1>
            {error && <p className="error">{error}</p>}

            <div className="book-section">
                <h2>Todos los Libros</h2>
                <ul>
                    {allBooks.length > 0 ? (
                        allBooks.map(book => (
                            <li key={book.id} className="book-item">
                                <h3 className="book-title">
                                    {book.title}
                                </h3>
                                <div className="book-actions">
                                    <button onClick={() => handleReserveBook(book.id)}>Reservar</button>
                                    <button onClick={() => handleFavoriteBook(book.id)}>
                                        {favoriteBooks.includes(book.id) ? '❤️ Favorito' : '♡ Favorito'}
                                    </button>
                                    <button onClick={() => handleMarkAsRead(book.id)}>Marcar como leído</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros disponibles</p>
                    )}
                </ul>
            </div>

            <div className="book-section">
                <h2>Libros Leídos</h2>
                <ul>
                    {readBooks.length > 0 ? (
                        readBooks.map(bookId => {
                            const book = allBooks.find(b => b.id === bookId);
                            return book ? <li key={book.id}><h3>{book.title}</h3></li> : null;
                        })
                    ) : (
                        <p>No hay libros leídos</p>
                    )}
                </ul>
            </div>

            <div className="book-section">
                <h2>Libros Reservados</h2>
                <ul>
                    {reservedBooks.length > 0 ? (
                        reservedBooks.map(book => (
                            <li key={book.id}>
                                <h3>{book.title}</h3>
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
