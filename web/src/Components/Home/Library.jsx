import React, { useEffect, useState } from 'react';
import './Library.css';

const Library = () => {
    const [allBooks, setAllBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Token o usuario no encontrado');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/books', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data = await res.json();
            setAllBooks(data);
            setReadBooks(data.filter((b) => b.status === 'read'));
            setReservedBooks(data.filter((b) => b.status === 'reserved'));
        } catch (err) {
            console.error(err);
            setError('Error al obtener los libros.');
        } finally {
            setLoading(false);
        }
    };

    const fetchReservedBooks = async () => {
        setLoading(true); // Asegura que el loading se active al inicio
        setError(null);   // Limpia errores previos

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/reservations/get', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data = await res.json();
            console.log(data);
            setReservedBooks(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener los libros reservados.');
        } finally {
            setLoading(false);
        }
    };


    const fetchFavoriteBooks = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {

            const res = await fetch('http://localhost:8080/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
            const data = await res.json();
            console.log(data);  // Verifica si la respuesta es la esperada
            setFavoriteBooks(data);
        } catch (err) {
            console.error('Error en fetchFavoriteBooks:', err);
            setError('Error al obtener los favoritos.');
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            await fetchBooks();
            await fetchFavoriteBooks();
        };
        loadAll();
    }, []);

    useEffect(() => {
        if (allBooks.length > 0) {
            fetchReservedBooks();
        }
    }, [allBooks]);

    const token = localStorage.getItem('authToken');
    if (!token) {
        return <p className="error">Token o usuario no encontrado</p>;
    }

    const handleReserveBook = async (bookId) => {
        if (reservedBooks.length >= 3) {
            setError('No podés reservar más de 3 libros');
            return;
        }

        const book = allBooks.find((b) => b.id === bookId);
        console.log(reservedBooks)
        if (!book || reservedBooks.some((b) => b.book.id === bookId)) return;

        const copy = book.copies?.[0];
        if (!copy) {
            setError('No hay copias disponibles');
            return;
        }

        const reservationDate = prompt('¿Para qué fecha querés reservarlo? (YYYY-MM-DD)');
        const period = prompt('¿Por cuántos días lo querés reservar? (número)');

        if (!reservationDate || !period || isNaN(parseInt(period))) {
            setError('Datos de reserva inválidos');
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/reservations/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    copyId: copy.id,
                    period: parseInt(period),
                    reservationDate: reservationDate,
                }),
            });

            if (!res.ok) {
                if (res.status === 409) {
                    setError('Este libro ya está reservado');
                } else {
                    throw new Error(res.statusText);
                }
                return;
            }

            const updatedBook = { ...book, status: 'reserved' };
            setAllBooks((prev) => prev.map((b) => (b.id === bookId ? updatedBook : b)));
            setReservedBooks((prev) => [...prev, updatedBook]);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al reservar el libro');
        }
    };

    const handleToggleFavorite = async (bookId) => {
        const isFavorite = favoriteBooks.some((b) => b.id === bookId);
        const endpoint = isFavorite
            ? `http://localhost:8080/api/favorites/remove?bookId=${bookId}`
            : `http://localhost:8080/api/favorites/add?bookId=${bookId}`;

        try {
            const res = await fetch(endpoint, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(res.statusText);

            setFavoriteBooks((prev) =>
                isFavorite
                    ? prev.filter((b) => b.id !== bookId)
                    : [...prev, allBooks.find((b) => b.id === bookId)]
            );

            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al actualizar favoritos');
        }
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
        setAllBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, status: '' } : b)));
    };

    const handleCancelReservation = async (bookId, reservationId) => {
        const book = allBooks.find((b) => b.id === bookId);
        const copy = book?.copies?.[0];
        if (!copy) return;

        try {
            const res = await fetch(`http://localhost:8080/api/reservations/cancel/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(res.statusText);

            setReservedBooks((prev) => prev.filter((b) => b.id !== bookId));
            setAllBooks((prev) => prev.map((b) => (b.id === bookId ? { ...b, status: '' } : b)));
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al cancelar la reserva');
        }
    };

    if (loading) return <p>Cargando libros...</p>;

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
                                    {book.status !== 'reserved' && (
                                        <button onClick={() => {
                                            console.log(book)
                                            handleReserveBook(book.id)
                                        }}>
                                            Reservar
                                        </button>
                                    )}
                                    <button
                                        className="favorito"
                                        onClick={() => handleToggleFavorite(book.id)}
                                    >
                                        {favoriteBooks.some((b) => b.id === book.id) ? '❤️' : '♡'} Favorito
                                    </button>
                                    {!readBooks.some((b) => b.id === book.id) && (
                                        <button onClick={() => handleMarkAsRead(book.id)}>
                                            Marcar como leído
                                        </button>
                                    )}
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
                                <h3 className="book-title">{b.book.title}</h3>
                                <div className="book-actions">
                                    <button onClick={() => handleCancelReservation(b.book.id, b.id)}>
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
                                    <button onClick={() => handleToggleFavorite(b.id)}>❤️</button>
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
