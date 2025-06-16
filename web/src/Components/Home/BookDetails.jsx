import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import './BookDetails.css';

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


    // Carga inicial: libro y estados desde localStorage
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

                setIsRead(JSON.parse(localStorage.getItem('readBooks') || '[]').includes(data.id));
                setIsReserved(JSON.parse(localStorage.getItem('reservedBooks') || '[]').includes(data.id));
                setIsFavorite(JSON.parse(localStorage.getItem('favoriteBooks') || '[]').some(b => b.id === data.id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const updateLocalList = (key, itemId, add) => {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        let updated;
        if (add) {
            if (!list.includes(itemId)) updated = [...list, itemId];
            else updated = list;
        } else {
            updated = list.filter(i => i !== itemId);
        }
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
    };

    const handleReserve = async () => {
        const token = localStorage.getItem('authToken');
        const copy = Array.isArray(book.copies) ? book.copies[0] : null;
        if (!copy) {
            setError('No hay copias disponibles');
            return;
        }
        try {
            const res = await fetch(
                `http://localhost:8080/api/book-copies/${copy.id}/reserve`,
                { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) {
                if (res.status === 409) setError('Ya está reservado');
                else throw new Error(res.statusText);
                return;
            }
            setIsReserved(true);
            updateLocalList('reservedBooks', book.id, true);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al reservar');
        }
    };

    const handleCancelReservation = async () => {
        const token = localStorage.getItem('authToken');
        const copy = Array.isArray(book.copies) ? book.copies[0] : null;
        if (!copy) return;
        try {
            const res = await fetch(
                `http://localhost:8080/api/book-copies/${copy.id}/cancel`,
                { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error(res.statusText);
            setIsReserved(false);
            updateLocalList('reservedBooks', book.id, false);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al cancelar reserva');
        }
    };

    const handleToggleFavorite = () => {
        const newFav = !isFavorite;
        setIsFavorite(newFav);
        updateLocalList('favoriteBooks', book.id, newFav);
    };

    const handleMarkAsRead = () => {
        setIsRead(true);
        updateLocalList('readBooks', book.id, true);
    };

    const handleUnmarkAsRead = () => {
        setIsRead(false);
        updateLocalList('readBooks', book.id, false);
    };

    // Enviar comentario al backend
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
                            <button onClick={handleUnmarkAsRead}>Desmarcar leído</button>
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
        </div>
    );
};

export default BookDetails;
