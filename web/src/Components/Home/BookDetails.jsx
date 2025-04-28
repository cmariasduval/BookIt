import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showReservationForm, setShowReservationForm] = useState(false);
  const [reservationDate, setReservationDate] = useState('');
  const [period, setPeriod] = useState(1);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${id}`);
        if (!response.ok) {
          throw new Error('Error fetching book');
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = 1; // ⚡⚡ ACA DE MOMENTO HARDCODEAMOS HASTA QUE TENGAS LOGIN (después tomás el userId real)
      const copyId = book.copyId; // OJO: tenés que asegurarte de tener la ID de la copia disponible
      
      const response = await fetch('http://localhost:8080/api/reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          userId,
          copyId,
          reservationDate,
          period,
        }),
      });

      if (!response.ok) {
        throw new Error('Error making reservation');
      }

      alert('¡Reserva realizada exitosamente!');
      setShowReservationForm(false); // Cerramos el formulario al éxito
    } catch (error) {
      console.error(error);
      alert('Hubo un error al reservar el libro.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="bookdetail-container">
      <div className="left-section">
        <img src={book.coverImage} alt={book.title} className="book-image" />
      </div>
      <div className="right-section">
        <h2 className="book-title">{book.title}</h2>
        <p className="book-author">{book.author}</p>
        <p className="book-publisher">{book.publisher}</p>
        <div className="book-genres">
          {book.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
        <p className="book-synopsis">{book.synopsis}</p>
        <p className="book-copies">Copies available: {book.copies}</p>
        <p className={`book-status ${book.status === "Available" ? "available" : "unavailable"}`}>
          {book.status}
        </p>

        {/* Botón para mostrar/ocultar el formulario */}
        <button onClick={() => setShowReservationForm(!showReservationForm)}>
          {showReservationForm ? 'Cancelar' : 'Reservar'}
        </button>

        {/* Formulario de reserva */}
        {showReservationForm && (
          <form className="reservation-form" onSubmit={handleReservationSubmit}>
            <div>
              <label>Fecha de Reserva:</label>
              <input 
                type="date" 
                value={reservationDate} 
                onChange={(e) => setReservationDate(e.target.value)} 
                required
              />
            </div>
            <div>
              <label>Período (días):</label>
              <input 
                type="number" 
                min="1" 
                max="30" 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)} 
                required
              />
            </div>
            <button type="submit">Confirmar Reserva</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
