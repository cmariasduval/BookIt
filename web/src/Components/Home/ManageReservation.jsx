import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, BookOpen, User, RefreshCw } from 'lucide-react';
import './ManageReservation.css';

function ManageReservations() {
    const [pickupsToday, setPickupsToday] = useState([]);
    const [latePickups, setLatePickups] = useState([]);
    const [returnsToday, setReturnsToday] = useState([]);
    const [lateReturns, setLateReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const token = localStorage.getItem('authToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [pickupsRes, latePickupsRes, returnsRes, lateReturnsRes] = await Promise.all([
                fetch('http://localhost:8080/api/reservations/pickups-today', { headers }),
                fetch('http://localhost:8080/api/reservations/late-pickups', { headers }),
                fetch('http://localhost:8080/api/reservations/returns-today', { headers }),
                fetch('http://localhost:8080/api/reservations/late-returns', { headers })
            ]);

            if (!pickupsRes.ok || !latePickupsRes.ok || !returnsRes.ok || !lateReturnsRes.ok) {
                throw new Error('Error al obtener los datos');
            }

            setPickupsToday(await pickupsRes.json());
            setLatePickups(await latePickupsRes.json());
            setReturnsToday(await returnsRes.json());
            setLateReturns(await lateReturnsRes.json());
            setError(null);
        } catch (err) {
            setError('Error cargando las reservas.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAction = async (id, action) => {
        try {
            // Usar PUT para las acciones de devolución, POST para las demás
            const method = (action === 'mark-returned' || action === 'mark-not-returned') ? 'PUT' : 'POST';

            const res = await fetch(`http://localhost:8080/api/reservations/${id}/${action}`, {
                method,
                headers
            });
            if (!res.ok) throw new Error('Error en la acción');

            // Actualiza el estado eliminando la reserva afectada
            if (action === 'mark-returned' || action === 'mark-not-returned') {
                setReturnsToday(prev => prev.filter(r => r.id !== id));
                setLateReturns(prev => prev.filter(r => r.id !== id));
            } else if (action === 'mark-picked-up' || action === 'mark-not-picked-up') {
                setPickupsToday(prev => prev.filter(r => r.id !== id));
                setLatePickups(prev => prev.filter(r => r.id !== id));
            }

            setSuccess('Reserva actualizada correctamente');
            setTimeout(() => setSuccess(null), 3000);
            setError(null);
        } catch (err) {
            setError('Error al actualizar la reserva');
        }
    };

    const ReservationCard = ({ reservation, actions, type }) => {
        if (!reservation) {
            return (
                <div className="reservation-card empty">
                    <div className="empty-state">
                        <BookOpen className="empty-icon" />
                        <span>No hay {type === 'pickup' ? 'reservas' : 'devoluciones'}</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="reservation-card">
                <div className="book-info">
                    <div className="book-title">
                        <BookOpen size={16} />
                        {reservation.bookTitle}
                    </div>
                    <div className="user-info">
                        <User size={14} />
                        {reservation.userName}
                    </div>
                </div>
                <div className="action-buttons">
                    <button
                        onClick={() => handleAction(reservation.id, actions.confirm)}
                        className="btn-success"
                        title="Confirmar"
                    >
                        <CheckCircle size={18} />
                    </button>
                    <button
                        onClick={() => handleAction(reservation.id, actions.decline)}
                        className="btn-danger"
                        title="Rechazar"
                    >
                        <XCircle size={18} />
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading-state">
                    <RefreshCw className="loading-icon" />
                    <p>Cargando reservas...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1>Gestión de Reservas</h1>
                <button onClick={loadData} className="refresh-btn" disabled={loading}>
                    <RefreshCw size={20} />
                    Actualizar
                </button>
            </div>

            {success && (
                <div className="alert alert-success">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            <div className="reservation-grid">
                <div className="column">
                    <div className="column-header pickup-today">
                        <Clock size={20} />
                        <span>Recoger Hoy</span>
                        <div className="badge">{pickupsToday.length}</div>
                    </div>
                    <div className="column-content">
                        {Math.max(1, pickupsToday.length) &&
                            Array.from({ length: Math.max(1, pickupsToday.length) }).map((_, i) => (
                                <ReservationCard
                                    key={i}
                                    reservation={pickupsToday[i]}
                                    actions={{
                                        confirm: 'mark-picked-up',
                                        decline: 'mark-not-picked-up'
                                    }}
                                    type="pickup"
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="column">
                    <div className="column-header pickup-late">
                        <AlertTriangle size={20} />
                        <span>Recoger Atrasado</span>
                        <div className="badge">{latePickups.length}</div>
                    </div>
                    <div className="column-content">
                        {Math.max(1, latePickups.length) &&
                            Array.from({ length: Math.max(1, latePickups.length) }).map((_, i) => (
                                <ReservationCard
                                    key={i}
                                    reservation={latePickups[i]}
                                    actions={{
                                        confirm: 'mark-picked-up',
                                        decline: 'mark-not-picked-up'
                                    }}
                                    type="pickup"
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="column">
                    <div className="column-header return-today">
                        <CheckCircle size={20} />
                        <span>Devolver Hoy</span>
                        <div className="badge">{returnsToday.length}</div>
                    </div>
                    <div className="column-content">
                        {Math.max(1, returnsToday.length) &&
                            Array.from({ length: Math.max(1, returnsToday.length) }).map((_, i) => (
                                <ReservationCard
                                    key={i}
                                    reservation={returnsToday[i]}
                                    actions={{
                                        confirm: 'mark-returned',
                                        decline: 'mark-not-returned'
                                    }}
                                    type="return"
                                />
                            ))
                        }
                    </div>
                </div>

                <div className="column">
                    <div className="column-header return-late">
                        <XCircle size={20} />
                        <span>Devolver Atrasado</span>
                        <div className="badge">{lateReturns.length}</div>
                    </div>
                    <div className="column-content">
                        {Math.max(1, lateReturns.length) &&
                            Array.from({ length: Math.max(1, lateReturns.length) }).map((_, i) => (
                                <ReservationCard
                                    key={i}
                                    reservation={lateReturns[i]}
                                    actions={{
                                        confirm: 'mark-returned',
                                        decline: 'mark-not-returned'
                                    }}
                                    type="return"
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageReservations;