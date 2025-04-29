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
            setError("Token no encontrado");
            return;
        }

        fetch('http://localhost:8080/api/books', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then(data => {
                setAllBooks(data);
                setReadBooks(data.filter(b => b.status === 'read'));
                setReservedBooks(data.filter(b => b.status === 'reserved'));
            })
            .catch(err => {
                console.error(err);
                setError("Error al obtener los libros.");
            });
    }, []);

    const handleReserveBook = (bookId) => {
        if (reservedBooks.length >= 3) {
            setError("No podés reservar más de 3 libros");
            return;
        }
        const book = allBooks.find(b => b.id === bookId);
        if (!book || reservedBooks.some(b => b.id === bookId)) return;

        setError(null);
        const updated = { ...book, status: 'reserved' };
        setAllBooks(prev => prev.map(b => b.id === bookId ? updated : b));
        setReservedBooks(prev => [...prev, updated]);
    };

    const handleToggleFavorite = (bookId) => {
        setFavoriteBooks(prev =>
            prev.some(b => b.id === bookId)
                ? prev.filter(b => b.id !== bookId)
                : [...prev, allBooks.find(b => b.id === bookId)]
        );
    };

    const handleMarkAsRead = (bookId) => {
        const book = allBooks.find(b => b.id === bookId);
        if (!book || readBooks.some(b => b.id === bookId)) return;

        const updated = { ...book, status: 'read' };
        setAllBooks(prev => prev.map(b => b.id === bookId ? updated : b));
        setReadBooks(prev => [...prev, updated]);
    };

    const handleUnmarkAsRead = (bookId) => {
        setReadBooks(prev => prev.filter(b => b.id !== bookId));
        setAllBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: '' } : b));
        setError(null);
    };

    const handleCancelReservation = (bookId) => {
        setReservedBooks(prev => prev.filter(b => b.id !== bookId));
        setAllBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: '' } : b));
        setError(null);
    };

    return (
        <div className="library-container">
            <h1>Biblioteca</h1>
            {error && <p className="error">{error}</p>}

            {/* Todos los Libros */}
            <div className="book-section">
                <h2>Todos los Libros</h2>
                <ul>
                    {allBooks.length > 0 ? allBooks.map(book => (
                        <li key={book.id} className="book-item">
                            <h3 className="book-title">{book.title}</h3>
                            <div className="book-actions">
                                <button onClick={() => handleReserveBook(book.id)}>Reservar</button>
                                <button
                                    className="favorito"
                                    onClick={() => handleToggleFavorite(book.id)}
                                >
                                    {favoriteBooks.some(b => b.id === book.id) ? '❤️' : '♡'} Favorito
                                </button>
                                <button onClick={() => handleMarkAsRead(book.id)}>Marcar como leído</button>
                            </div>
                        </li>
                    )) : (
                        <p>No hay libros disponibles</p>
                    )}
                </ul>
            </div>

            {/* Libros Leídos */}
            <div className="book-section">
                <h2>Libros Leídos</h2>
                <ul>
                    {readBooks.length > 0 ? readBooks.map(b => (
                        <li key={b.id} className="book-item">
                            <h3 className="book-title">{b.title}</h3>
                            <div className="book-actions">
                                <button onClick={() => handleUnmarkAsRead(b.id)}>✓</button>
                            </div>
                        </li>
                    )) : (
                        <p>No hay libros leídos</p>
                    )}
                </ul>
            </div>

            {/* Libros Reservados */}
            <div className="book-section">
                <h2>Libros Reservados</h2>
                <ul>
                    {reservedBooks.length > 0 ? reservedBooks.map(b => (
                        <li key={b.id} className="book-item">
                            <h3 className="book-title">{b.title}</h3>
                            <div className="book-actions">
                                <button onClick={() => handleCancelReservation(b.id)}>Cancelar</button>
                            </div>
                        </li>
                    )) : (
                        <p>No hay libros reservados</p>
                    )}
                </ul>
            </div>

            {/* Libros Favoritos */}
            <div className="book-section">
                <h2>Libros Favoritos</h2>
                <ul>
                    {favoriteBooks.length > 0 ? favoriteBooks.map(b => (
                        <li key={b.id} className="book-item">
                            <h3 className="book-title">{b.title}</h3>
                            <div className="book-actions">
                                <button
                                    className="favorito"
                                    onClick={() => handleToggleFavorite(b.id)}
                                >
                                    {'❤️'}
                                </button>
                            </div>
                        </li>
                    )) : (
                        <p>No hay libros favoritos</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Library;
