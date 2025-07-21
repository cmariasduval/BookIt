import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Library.css';
import BookCarousel from './BookCarousel';

const Library = () => {
    const navigate = useNavigate();
    const [readBooks, setReadBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('authToken');

    const fetchReadBooks = async () => {
        if (!token) return;

        try {
            // Obtener IDs de libros leídos desde localStorage
            const storedReadBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');

            if (storedReadBooks.length > 0) {
                // Obtener detalles completos de cada libro leído
                const bookPromises = storedReadBooks.map(async (bookId) => {
                    const res = await fetch(`http://localhost:8080/api/books/${bookId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (res.ok) {
                        return await res.json();
                    }
                    return null;
                });

                const books = await Promise.all(bookPromises);
                setReadBooks(books.filter(book => book !== null));
            } else {
                setReadBooks([]);
            }
        } catch (err) {
            console.error('Error fetching read books:', err);
            setError('Error al obtener los libros leídos.');
        }
    };

    const fetchReservedBooks = async () => {
        if (!token) return;

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
            setReservedBooks(data);
        } catch (err) {
            console.error('Error fetching reserved books:', err);
            setError('Error al obtener los libros reservados.');
        }
    };

    const fetchFavoriteBooks = async () => {
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
            setFavoriteBooks(data);
        } catch (err) {
            console.error('Error fetching favorite books:', err);
            setError('Error al obtener los favoritos.');
        }
    };

    useEffect(() => {
        const loadAllData = async () => {
            if (!token) {
                setError('Token o usuario no encontrado');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                await Promise.all([
                    fetchReadBooks(),
                    fetchReservedBooks(),
                    fetchFavoriteBooks()
                ]);
            } catch (err) {
                console.error('Error loading library data:', err);
                setError('Error al cargar los datos de la biblioteca');
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [token]);

    // Función para refrescar los datos cuando el usuario regrese de Book Details
    const refreshLibrary = () => {
        const loadAllData = async () => {
            try {
                await Promise.all([
                    fetchReadBooks(),
                    fetchReservedBooks(),
                    fetchFavoriteBooks()
                ]);
            } catch (err) {
                console.error('Error refreshing library data:', err);
            }
        };
        loadAllData();
    };

    // Escuchar cambios en el localStorage para libros leídos
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'readBooks') {
                fetchReadBooks();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [token]);

    // Agregar event listeners para clics en libros (solución alternativa)
    useEffect(() => {
        const handleBookCardClick = (e) => {
            const bookCard = e.target.closest('[data-book-id]');
            if (bookCard) {
                const bookId = bookCard.getAttribute('data-book-id');
                navigate(`/bookDetails/${bookId}`);
            }
        };

        document.addEventListener('click', handleBookCardClick);
        return () => document.removeEventListener('click', handleBookCardClick);
    }, [navigate]);

    // Función para manejar el clic en un libro y navegar a sus detalles
    const handleBookClick = (bookId) => {
        navigate(`/bookDetails/${bookId}`);
    };

    if (!token) {
        return (
            <div className="my-library-container">
                <div className="error-container">
                    <p className="error">Debes iniciar sesión para ver tu biblioteca</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="my-library-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading">Cargando tu biblioteca...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-library-container">
            <div className="library-header">
                <h1>Mi Biblioteca</h1>
            </div>

            {error && (
                <div className="error-banner">
                    <p className="error">{error}</p>
                    <button onClick={refreshLibrary} className="retry-btn">
                        Reintentar
                    </button>
                </div>
            )}

            {/* Sección de Libros Reservados */}
            <div className="library-section">
                <div className="section-header">
                    <h2>📚 Reservas </h2>
                    <span className="section-count">
                        {reservedBooks.length} libro{reservedBooks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {reservedBooks.length > 0 ? (
                    <BookCarousel
                        books={reservedBooks.map(reservation => ({
                            ...reservation.book,
                            reservationDetails: {
                                id: reservation.id,
                                pickupDate: reservation.pickupDate,
                                period: reservation.period
                            }
                        }))}
                        type="reserved"
                        showActionButton={false}
                        onBookClick={handleBookClick} // Pasamos la función de navegación
                    />
                ) : (
                    <div className="empty-section">
                        <div className="empty-content">
                            <span className="empty-icon">📚</span>
                            <h3>No tienes libros reservados</h3>
                            <p>Ve a "Todos los libros" para encontrar algo interesante para reservar</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Libros Leídos */}
            <div className="library-section">
                <div className="section-header">
                    <h2>✅ Leídos</h2>
                    <span className="section-count">
                        {readBooks.length} libro{readBooks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {readBooks.length > 0 ? (
                    <BookCarousel
                        books={readBooks}
                        type="read"
                        showActionButton={false}
                        onBookClick={handleBookClick} // Pasamos la función de navegación
                    />
                ) : (
                    <div className="empty-section">
                        <div className="empty-content">
                            <span className="empty-icon">📖</span>
                            <h3>No has marcado ningún libro como leído</h3>
                            <p>Cuando termines de leer un libro, márcalo como leído desde sus detalles</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de Libros Favoritos */}
            <div className="library-section">
                <div className="section-header">
                    <h2>❤️ Favoritos</h2>
                    <span className="section-count">
                        {favoriteBooks.length} libro{favoriteBooks.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {favoriteBooks.length > 0 ? (
                    <BookCarousel
                        books={favoriteBooks}
                        type="favorites"
                        showActionButton={false}
                        onBookClick={handleBookClick} // Pasamos la función de navegación
                    />
                ) : (
                    <div className="empty-section">
                        <div className="empty-content">
                            <span className="empty-icon">❤️</span>
                            <h3>No tienes libros favoritos</h3>
                            <p>Marca como favoritos los libros que más te gusten desde sus detalles</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mensaje informativo */}
            <div className="info-section">
                <div className="info-card">
                    <h3>💡 ¿Cómo gestionar tus libros?</h3>
                    <ul>
                        <li>🔍 Ve a "Todos los libros" para explorar el catálogo completo</li>
                        <li>📖 Haz clic en cualquier libro para ver sus detalles</li>
                        <li>⚡ Desde los detalles puedes reservar, favoritar o marcar como leído</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Library;