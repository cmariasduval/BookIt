import React, { useEffect, useState } from 'react';
import './ManageReservation.css';


function ManageReservations() {
    const [pickupsToday, setPickupsToday] = useState([]);
    const [latePickups, setLatePickups] = useState([]);
    const [returnsToday, setReturnsToday] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('authToken');
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    // Carga todos los datos
    const loadData = async () => {
        setLoading(true);
        try {
            const [pickupsRes, lateRes, returnsRes] = await Promise.all([
                fetch('http://localhost:8080/api/reservations/pickups-today', { headers }),
                fetch('http://localhost:8080/api/reservations/late-pickups', { headers }),
                fetch('http://localhost:8080/api/reservations/returns-today', { headers })
            ]);

            if (!pickupsRes.ok || !lateRes.ok || !returnsRes.ok) {
                throw new Error('Error al obtener los datos');
            }

            const pickupsData = await pickupsRes.json();
            const latePickupsData = await lateRes.json();
            const returnsData = await returnsRes.json();

            setPickupsToday(pickupsData);
            setLatePickups(latePickupsData);
            setReturnsToday(returnsData);
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

    // Handler genérico para marcar acciones
    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`http://localhost:8080/api/reservations/${id}/${action}`, {
                method: 'POST',
                headers
            });
            if (!res.ok) throw new Error('Error en la acción');
            loadData();
        } catch (err) {
            setError('Error al actualizar la reserva');
        }
    };

    if (loading) return <p>Cargando reservas...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h1>Manage Reservations</h1>
            <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                <tr>
                    <th>Pick-up (Retirar hoy)</th>
                    <th>Late Pick-ups (Retrasadas)</th>
                    <th>Returns (Devolver hoy)</th>
                </tr>
                </thead>
                <tbody>
                {Array.from({
                    length: Math.max(pickupsToday.length, latePickups.length, returnsToday.length),
                }).map((_, i) => {
                    const pickup = pickupsToday[i];
                    const late = latePickups[i];
                    const ret = returnsToday[i];
                    return (
                        <tr key={i}>
                            {/* Pick-up */}
                            <td style={{ verticalAlign: 'top' }}>
                                {pickup ? (
                                    <>
                                        <div><b>{pickup.bookTitle}</b></div>
                                        <div>Usuario: {pickup.username}</div>
                                        <button onClick={() => handleAction(pickup.id, 'mark-picked-up')} title="Entregado">✅</button>{' '}
                                        <button onClick={() => handleAction(pickup.id, 'mark-not-picked-up')} title="No entregado">❌</button>
                                    </>
                                ) : (
                                    <em>No hay reservas</em>
                                )}
                            </td>

                            {/* Late pick-up */}
                            <td style={{ verticalAlign: 'top' }}>
                                {late ? (
                                    <>
                                        <div><b>{late.bookTitle}</b></div>
                                        <div>Usuario: {late.username}</div>
                                        <button onClick={() => handleAction(late.id, 'mark-picked-up')} title="Entregado">✅</button>{' '}
                                        <button onClick={() => handleAction(late.id, 'mark-not-picked-up')} title="No entregado">❌</button>
                                    </>
                                ) : (
                                    <em>No hay reservas</em>
                                )}
                            </td>

                            {/* Return */}
                            <td style={{ verticalAlign: 'top' }}>
                                {ret ? (
                                    <>
                                        <div><b>{ret.bookTitle}</b></div>
                                        <div>Usuario: {ret.username}</div>
                                        <button onClick={() => handleAction(ret.id, 'mark-returned')} title="Devuelto">✅</button>{' '}
                                        <button onClick={() => handleAction(ret.id, 'mark-not-returned')} title="No devuelto">❌</button>
                                    </>
                                ) : (
                                    <em>No hay devoluciones</em>
                                )}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default ManageReservations;
