import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllBooks.css';

const AllBooks = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [limit] = useState(12);  // libros por página
    const [sort] = useState('title'); // ordenar por título
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        const fetchBooks = async () => {
            if (!token) {
                setError('Token o usuario no encontrado');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/api/books/all?page=${page}&limit=${limit}&sort=${sort}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!res.ok) throw new Error(`Error ${res.status}`);

                const data = await res.json();
                console.log('Datos recibidos del backend:', data);

                setBooks(data.content); // data.content es el arreglo de libros de la página actual
                setTotalPages(data.totalPages); // total de páginas que trae Spring Data Page
                setError(null);
            } catch (err) {
                setError('Error al obtener los libros.');
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [token, page, limit, sort]);

    if (loading) return <p>Cargando libros...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="allbooks-container">
            <h1>Todos los libros</h1>

            {books.length === 0 && <p>No se encontraron libros.</p>}

            <div className="books-list">
                {books.map((book) => (
                    <div
                        key={book.id}
                        className="book-item"
                        onClick={() => navigate(`/bookDetails/${book.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        {book.imageUrl ? (
                            <img src={book.imageUrl} alt={book.title} className="book-cover" />
                        ) : (
                            <div className="book-placeholder">📚</div>
                        )}
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p>{book.author}</p>
                            {/* Opcional: mostrar géneros si querés */}
                            {/* <p>{book.genres?.map(g => g.genreType).join(', ')}</p> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación simple */}
            <div className="pagination">
                <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
                    Anterior
                </button>
                <span>
          Página {page + 1} de {totalPages}
        </span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page + 1 >= totalPages}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default AllBooks;
