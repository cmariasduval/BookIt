import React, { useState } from 'react';
import './ReservationModal.css';

const ReservationModal = ({ book, onClose, onConfirm }) => {
    const [reservationDate, setReservationDate] = useState('');
    const [period, setPeriod] = useState('');

    const handleSubmit = () => {
        if (!reservationDate || isNaN(parseInt(period))) {
            alert('Datos inválidos');
            return;
        }
        onConfirm(book.id, reservationDate, parseInt(period));
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Reservar: {book.title}</h3>
                <label>
                    Fecha de reserva:
                    <input
                        type="date"
                        value={reservationDate}
                        onChange={(e) => setReservationDate(e.target.value)}
                    />
                </label>
                <label>
                    Período (días):
                    <input
                        type="number"
                        min="1"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    />
                </label>
                <div className="modal-buttons">
                    <button onClick={handleSubmit}>Confirmar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;
