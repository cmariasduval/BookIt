import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import './BookDetails.css';
import ReservationModal from './ReservationModal';

const BookDetails = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isRead, setIsRead] = useState(false);
    const [isReserved, setIsReserved] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);

    // Estados para comentarios y rating
    const [commentOpen, setCommentOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [rating, setRating] = useState(0);

    // Estados para listas de libros (como en Library)
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [reservedBooks, setReservedBooks] = useState([]);

    // Estados para el modal de reserva
    const [showReservationModal, setShowReservationModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const email = user.email;
                setIsAdmin(email?.endsWith("@admin.com"));
            } catch (e) {
                console.error("Usuario inválido", e);
                setIsAdmin(false);
            }
        }
    }, []);

    // Fetch de favoritos (como en Library)
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

            if (res.ok) {
                const data = await res.json();
                setFavoriteBooks(data);
            }
        } catch (err) {
            console.error('Error en fetchFavoriteBooks:', err);
        }
    };

    const fetchReservedBooks = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const res = await fetch('http://localhost:8080/api/reservations/get', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                setReservedBooks(data);
            }
        } catch (err) {
            console.error('Error en fetchReservedBooks:', err);
        }
    };

    // Cargar libros leídos desde localStorage
    useEffect(() => {
        const storedReadBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');
        // Convertir los IDs a objetos con estructura similar a los otros arrays
        setReadBooks(storedReadBooks.map(bookId => ({ id: bookId })));
    }, []);

    // Carga inicial: libro y estados
    useEffect(() => {
        const fetchBook = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch(`http://localhost:8080/api/books/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!res.ok) throw new Error('Error al cargar el libro');
                const data = await res.json();
                setBook(data);
                console.log("Datos del libro:", data);

                // Cargar listas de favoritos y reservados
                await fetchFavoriteBooks();
                await fetchReservedBooks();

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    // Actualizar estados locales basado en las listas cargadas (como en Library)
    useEffect(() => {
        if (book) {
            setIsFavorite(favoriteBooks.some(b => b.id === book.id));
            setIsReserved(reservedBooks.some(b => b.book.id === book.id));
            setIsRead(readBooks.some(b => b.id === book.id));
        }
    }, [book, favoriteBooks, reservedBooks, readBooks]);

    // Reservar libro usando el modal (como en Library)
    const handleReserveConfirmed = async (bookId, pickupDate, period) => {
        // Verificar que el usuario no tenga más de 3 reservas
        if (reservedBooks.length >= 3) {
            setError('No podés reservar más de 3 libros');
            return;
        }

        // Verificar que el libro no esté ya reservado
        if (reservedBooks.some((b) => b.book.id === bookId)) {
            setError('Este libro ya está reservado');
            return;
        }

        // Obtener la primera copia del libro
        const copy = book.copies?.[0];
        if (!copy) {
            setError('No hay copias disponibles');
            return;
        }

        // Obtener el token
        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch(`http://localhost:8080/api/reservations/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    copyId: copy.id,
                    pickupDate: pickupDate,
                    period: parseInt(period),
                }),
            });

            if (!res.ok) {
                if (res.status === 403) {
                    setError('No puede hacer reserva porque se encuentra bloqueado por haber cometido 3 infracciones.');
                } else if (res.status === 409) {
                    setError('Este libro ya está reservado');
                } else {
                    setError(`Error ${res.status}: ${res.statusText}`);
                }
                return;
            }

            // Obtener los datos de la respuesta con el ID real de la reserva
            const reservationData = await res.json();

            // Actualizar el estado: marcar el libro como reservado y agregarlo a la lista de reservados
            setIsReserved(true);
            setReservedBooks((prev) => [...prev, {
                book: book,
                id: reservationData.id || reservationData.reservationId // Usar el ID real del backend
            }]);
            setError(null);

            // Cerrar el modal
            setShowReservationModal(false);

        } catch (err) {
            console.error(err);
            setError('Error al reservar el libro');
        }
    };

    // Abrir modal de reserva
    const handleReserve = () => {
        if (reservedBooks.length >= 3) {
            setError('No podés reservar más de 3 libros');
            return;
        }

        if (reservedBooks.some(b => b.book.id === book.id)) {
            setError('Este libro ya está reservado');
            return;
        }

        const copy = book.copies?.[0];
        if (!copy) {
            setError('No hay copias disponibles');
            return;
        }

        setShowReservationModal(true);
    };

    // Cancelar reserva (como en Library)
    const handleCancelReservation = async () => {
        // Buscar la reserva en el array local
        const reservation = reservedBooks.find(b => b.book.id === book.id);

        // Si no se encuentra en el array local, recargar las reservas primero
        if (!reservation) {
            await fetchReservedBooks();
            const updatedReservation = reservedBooks.find(b => b.book.id === book.id);
            if (!updatedReservation) {
                setError('No se encontró la reserva');
                return;
            }
        }

        const token = localStorage.getItem('authToken');
        const reservationId = reservation ? reservation.id : null;

        if (!reservationId || reservationId === 'temp') {
            // Si el ID es temporal o no existe, recargar reservas y intentar de nuevo
            await fetchReservedBooks();
            const freshReservation = reservedBooks.find(b => b.book.id === book.id);
            if (!freshReservation || freshReservation.id === 'temp') {
                setError('No se pudo obtener el ID de reserva válido');
                return;
            }
        }

        try {
            const res = await fetch(`http://localhost:8080/api/reservations/cancel/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                if (res.status === 404) {
                    setError('La reserva no existe o ya fue cancelada');
                } else {
                    throw new Error(`Error ${res.status}: ${res.statusText}`);
                }
                return;
            }

            setIsReserved(false);
            setReservedBooks(prev => prev.filter(b => b.book.id !== book.id));
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al cancelar la reserva');
        }
    };

    // Toggle favorito (como en Library)
    const handleToggleFavorite = async () => {
        const isFav = favoriteBooks.some(b => b.id === book.id);
        const endpoint = isFav
            ? `http://localhost:8080/api/favorites/remove?bookId=${book.id}`
            : `http://localhost:8080/api/favorites/add?bookId=${book.id}`;

        const token = localStorage.getItem('authToken');

        try {
            const res = await fetch(endpoint, {
                method: isFav ? 'DELETE' : 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(res.statusText);

            setFavoriteBooks(prev =>
                isFav
                    ? prev.filter(b => b.id !== book.id)
                    : [...prev, book]
            );

            setIsFavorite(!isFav);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al actualizar favoritos');
        }
    };

    // Marcar como leído (con persistencia en localStorage)
    const handleMarkAsRead = () => {
        if (readBooks.some(b => b.id === book.id)) return;

        // Actualizar el estado local
        const updatedBook = { ...book, status: 'read' };
        setReadBooks(prev => [...prev, { id: book.id, ...updatedBook }]);
        setIsRead(true);

        // Persistir en localStorage
        const storedReadBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');
        if (!storedReadBooks.includes(book.id)) {
            storedReadBooks.push(book.id);
            localStorage.setItem('readBooks', JSON.stringify(storedReadBooks));
        }
    };

    const handleUnmarkAsRead = () => {
        // Actualizar el estado local
        setReadBooks(prev => prev.filter(b => b.id !== book.id));
        setIsRead(false);

        // Actualizar localStorage
        const storedReadBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');
        const updatedStoredBooks = storedReadBooks.filter(id => id !== book.id);
        localStorage.setItem('readBooks', JSON.stringify(updatedStoredBooks));
    };

    // Enviar comentario al backend (sin cambios)
    const submitComment = async () => {
        if (!commentText.trim()) {
            alert("El comentario está vacío");
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("Tenés que estar logueado para comentar");
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookId: book.id,
                    comment: commentText.trim(),
                    rating: rating
                })
            });

            if (!res.ok) {
                throw new Error(`Error al enviar comentario: ${res.statusText}`);
            }

            alert("Comentario enviado correctamente");
            setCommentText("");
            setCommentOpen(false);
            // Opcional: recargar comentarios
        } catch (error) {
            console.error(error);
            alert("Error enviando comentario");
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!book) return <div>No se encontró el libro</div>;

    const copiesCount = Array.isArray(book.copies)
        ? book.copies.length
        : typeof book.copies === 'number'
            ? book.copies
            : 0;

    return (
        <div className="bookdetail-container">
            <div className='upper-section'>
                <button type="button" onClick={() => navigate("/home")}>
                    <IoMdArrowBack size={24} />
                </button>
            </div>
            <div className='lower-section'>
                <div className="left-section">
                    <img
                        src={book.imageUrl}
                        alt={`Portada de ${book.title}`}
                        className="book-image"
                    />
                </div>
                <div className="right-section">
                    <h2 className="book-title">{book.title}</h2>
                    <p><strong>Autor:</strong> {book.author}</p>
                    <p><strong>Editorial:</strong> {book.publisher}</p>
                    <div className="book-genres">
                        <strong>Géneros:</strong>{' '}
                        {book.genres.map((g, index) => (
                            <span key={g.id} className="genre-tag">
                                {g.genreType}
                                {index < book.genres.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </div>
                    <p><strong>Sinopsis:</strong> {book.synopsis}</p>
                    <p><strong>Copias disponibles:</strong> {copiesCount}</p>
                    <p>
                        <strong>Estado:</strong>{' '}
                        <span className={book.status === 'Available' ? 'available' : 'unavailable'}>
                            {book.status}
                        </span>
                    </p>
                    <div className="book-actions">
                        {isReserved ? (
                            <button onClick={handleCancelReservation}>Cancelar reserva</button>
                        ) : (
                            <button onClick={handleReserve}>Reservar</button>
                        )}
                        <button onClick={handleToggleFavorite}>
                            {isFavorite ? '❤️ Favorito' : '♡ Favorito'}
                        </button>
                        {isRead ? (
                            <button onClick={handleUnmarkAsRead}>✓ Leído</button>
                        ) : (
                            <button onClick={handleMarkAsRead}>Marcar como leído</button>
                        )}
                        {isAdmin && (
                            <button onClick={() => navigate(`/bookDetails/${book.id}/editbook`)}>
                                Editar libro
                            </button>
                        )}
                    </div>

                    {/* Comentarios y rating */}
                    <div style={{ marginTop: "1em" }}>
                        <button onClick={() => setCommentOpen(!commentOpen)}>
                            {commentOpen ? "Cancelar comentario" : "Dejar comentario"}
                        </button>
                    </div>

                    {commentOpen && (
                        <div style={{ marginTop: "1em" }}>
                            <textarea
                                rows="4"
                                cols="50"
                                placeholder="Escribí tu comentario aquí..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <br />
                            <div style={{ marginTop: "1em" }}>
                                <label>Seleccioná estrellas: </label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    <option value={0}>--</option>
                                    <option value={1}>⭐</option>
                                    <option value={2}>⭐⭐</option>
                                    <option value={3}>⭐⭐⭐</option>
                                    <option value={4}>⭐⭐⭐⭐</option>
                                    <option value={5}>⭐⭐⭐⭐⭐</option>
                                </select>
                                <br />
                            </div>
                            <button onClick={submitComment}>Enviar comentario</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de reserva */}
            {showReservationModal && book && (
                <ReservationModal
                    book={book}
                    onClose={() => setShowReservationModal(false)}
                    onConfirm={handleReserveConfirmed}
                />
            )}
        </div>
    );
};

export default BookDetails;