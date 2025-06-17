import React, { useEffect, useState } from 'react';
import './ManageReservation.css';

function ManageReservations() {
    const [pickupsToday, setPickupsToday] = useState([]);
    const [latePickups, setLatePickups] = useState([]);
    const [returnsToday, setReturnsToday] = useState([]);
    const [lateReturns, setLateReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            const pickupsData = await pickupsRes.json();
            const latePickupsData = await latePickupsRes.json();
            const returnsData = await returnsRes.json();
            const lateReturnsData = await lateReturnsRes.json();

            setPickupsToday(pickupsData);
            setLatePickups(latePickupsData);
            setReturnsToday(returnsData);
            setLateReturns(lateReturnsData);
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
                    <th>Late Returns (Devoluciones tardías)</th>
                </tr>
                </thead>
                <tbody>
                {Array.from({
                    length: Math.max(
                        pickupsToday.length,
                        latePickups.length,
                        returnsToday.length,
                        lateReturns.length
                    ),
                }).map((_, i) => {
                    const pickup = pickupsToday[i];
                    const late = latePickups[i];
                    const ret = returnsToday[i];
                    const lateRet = lateReturns[i];
                    return (
                        <tr key={i}>
                            <td style={{ verticalAlign: 'top' }}>
                                {pickup ? (
                                    <>
                                        <div><b>{pickup.bookTitle}</b></div>
                                        <div>Usuario: {pickup.userName}</div>
                                        <button onClick={() => handleAction(pickup.id, 'mark-picked-up')}>✅</button>{' '}
                                        <button onClick={() => handleAction(pickup.id, 'mark-not-picked-up')}>❌</button>
                                    </>
                                ) : (
                                    <em>No hay reservas</em>
                                )}
                            </td>

                            <td style={{ verticalAlign: 'top' }}>
                                {late ? (
                                    <>
                                        <div><b>{late.bookTitle}</b></div>
                                        <div>Usuario: {late.userName}</div>
                                        <button onClick={() => handleAction(late.id, 'mark-picked-up')}>✅</button>{' '}
                                        <button onClick={() => handleAction(late.id, 'mark-not-picked-up')}>❌</button>
                                    </>
                                ) : (
                                    <em>No hay reservas</em>
                                )}
                            </td>

                            <td style={{ verticalAlign: 'top' }}>
                                {ret ? (
                                    <>
                                        <div><b>{ret.bookTitle}</b></div>
                                        <div>Usuario: {ret.userName}</div>
                                        <button onClick={() => handleAction(ret.id, 'mark-returned')}>✅</button>{' '}
                                        <button onClick={() => handleAction(ret.id, 'mark-not-returned')}>❌</button>
                                    </>
                                ) : (
                                    <em>No hay devoluciones</em>
                                )}
                            </td>

                            <td style={{ verticalAlign: 'top' }}>
                                {lateRet ? (
                                    <>
                                        <div><b>{lateRet.bookTitle}</b></div>
                                        <div>Usuario: {lateRet.userName}</div>
                                        <button onClick={() => handleAction(lateRet.id, 'mark-returned')}>✅</button>{' '}
                                        <button onClick={() => handleAction(lateRet.id, 'mark-not-returned')}>❌</button>
                                    </>
                                ) : (
                                    <em>No hay devoluciones tardías</em>
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
