import React, { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Token no encontrado');
            return;
        }

        fetch('http://localhost:8080/api/books', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then((data) => {
                setAllBooks(data);
                setReadBooks(data.filter((b) => b.status === 'read'));
                setReservedBooks(data.filter((b) => b.status === 'reserved'));
            })
            .catch((err) => {
                console.error(err);
                setError('Error al obtener los libros.');
            });
    }, []);

    const handleReserveBook = async (bookId) => {
        if (reservedBooks.length >= 3) {
            setError('No podés reservar más de 3 libros');
            return;
        }
        const token = localStorage.getItem('authToken');
        const book = allBooks.find((b) => b.id === bookId);
        if (!book || reservedBooks.some((b) => b.id === bookId)) return;

        // Suponemos que usamos la primera copia
        const copy = book.copies?.[0];
        if (!copy) {
            setError('No hay copias disponibles');
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/book-copies/${copy.id}/reserve`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!res.ok) {
                if (res.status === 409) setError('Este libro ya está reservado');
                else throw new Error(res.statusText);
                return;
            }
            const updatedCopy = await res.json();
            const updatedBook = { ...book, status: 'reserved' };
            setAllBooks((prev) => prev.map((b) => (b.id === bookId ? updatedBook : b)));
            setReservedBooks((prev) => [...prev, updatedBook]);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al reservar el libro');
        }
    };

    const handleCancelReservation = async (bookId) => {
        const token = localStorage.getItem('authToken');
        const book = allBooks.find((b) => b.id === bookId);
        if (!book) return;
        const copy = book.copies?.[0];
        if (!copy) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/book-copies/${copy.id}/cancel`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error(res.statusText);
            // Actualizar frontend
            setReservedBooks((prev) => prev.filter((b) => b.id !== bookId));
            setAllBooks((prev) =>
                prev.map((b) => (b.id === bookId ? { ...b, status: '' } : b))
            );
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al cancelar la reserva');
        }
    };

    const handleToggleFavorite = (bookId) => {
        setFavoriteBooks((prev) =>
            prev.some((b) => b.id === bookId)
                ? prev.filter((b) => b.id !== bookId)
                : [...prev, allBooks.find((b) => b.id === bookId)]
        );
    };

    const handleMarkAsRead = (bookId) => {
        const book = allBooks.find((b) => b.id === bookId);
        if (!book || readBooks.some((b) => b.id === bookId)) return;

        const updatedBook = { ...book, status: 'read' };
        setAllBooks((prev) => prev.map((b) => (b.id === bookId ? updatedBook : b)));
        setReadBooks((prev) => [...prev, updatedBook]);
    };

    const handleUnmarkAsRead = (bookId) => {
        setReadBooks((prev) => prev.filter((b) => b.id !== bookId));
        setAllBooks((prev) =>
            prev.map((b) => (b.id === bookId ? { ...b, status: '' } : b))
        );
        setError(null);
    };

    return (
        <div className="library-container">
            <h1>Biblioteca</h1>
            {error && <p className="error">{error}</p>}

            <div className="book-section">
                <h2>Todos los Libros</h2>
                <ul>
                    {allBooks.length > 0 ? (
                        allBooks.map((book) => (
                            <li key={book.id} className="book-item">
                                <h3 className="book-title">{book.title}</h3>
                                <div className="book-actions">
                                    <button onClick={() => handleReserveBook(book.id)}>
                                        Reservar
                                    </button>
                                    <button
                                        className="favorito"
                                        onClick={() => handleToggleFavorite(book.id)}
                                    >
                                        {favoriteBooks.some((b) => b.id === book.id) ? '❤️' : '♡'} Favorito
                                    </button>
                                    <button onClick={() => handleMarkAsRead(book.id)}>
                                        Marcar como leído
                                    </button>
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
                        readBooks.map((b) => (
                            <li key={b.id} className="book-item">
                                <h3 className="book-title">{b.title}</h3>
                                <div className="book-actions">
                                    <button onClick={() => handleUnmarkAsRead(b.id)}>✓</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros leídos</p>
                    )}
                </ul>
            </div>

            <div className="book-section">
                <h2>Libros Reservados</h2>
                <ul>
                    {reservedBooks.length > 0 ? (
                        reservedBooks.map((b) => (
                            <li key={b.id} className="book-item">
                                <h3 className="book-title">{b.title}</h3>
                                <div className="book-actions">
                                    <button onClick={() => handleCancelReservation(b.id)}>
                                        Cancelar
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros reservados</p>
                    )}
                </ul>
            </div>

            <div className="book-section">
                <h2>Libros Favoritos</h2>
                <ul>
                    {favoriteBooks.length > 0 ? (
                        favoriteBooks.map((b) => (
                            <li key={b.id} className="book-item">
                                <h3 className="book-title">{b.title}</h3>
                                <div className="book-actions">
                                    <button
                                        className="favorito"
                                        onClick={() => handleToggleFavorite(b.id)}
                                    >
                                        ❤️
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No hay libros favoritos</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Library;
