import React, { useEffect, useState } from 'react';

const ManageInfractions = () => {
    const [usersWithDebt, setUsersWithDebt] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);

    useEffect(() => {
        fetchUsersWithDebt();
    }, []);

    const fetchUsersWithDebt = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('http://localhost:8080/api/infractions/pending', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            const data = await res.json();
            setUsersWithDebt(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener las infracciones.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayDebt = async (userId) => {
        setUpdatingUserId(userId);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            setUpdatingUserId(null);
            return;
        }
        try {
            // CORRECCIÓN: URL corregida para coincidir con backend
            const res = await fetch(`http://localhost:8080/api/infractions/users/${userId}/pay-debt`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            // Actualizamos la lista local para reflejar deuda 0 e infracciones 0
            setUsersWithDebt(prev =>
                prev.map(u => u.userId === userId ? { ...u, debt: 0, infractionCount: 0 } : u)
            );
        } catch (err) {
            console.error(err);
            setError('Error al actualizar la deuda.');
        } finally {
            setUpdatingUserId(null);
        }
    };

    if (loading) return <p>Cargando infracciones...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="infractions-container">
            <h1>Gestión de Infracciones</h1>
            {usersWithDebt.length > 0 ? (
                <ul>
                    {usersWithDebt.map(user => (
                        <li key={user.userId}>
                            <strong>{user.username || 'Usuario desconocido'}</strong> - Deuda: ${user.debt.toFixed(2)} - Infracciones: {user.infractionCount}
                            <button
                                onClick={() => handlePayDebt(user.id)}
                                disabled={updatingUserId === user.id || user.debt === 0}
                                style={{ marginLeft: '10px' }}
                            >
                                {updatingUserId === user.id ? 'Actualizando...' : 'Pagar deuda'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay infracciones registradas.</p>
            )}
        </div>
    );
};

export default ManageInfractions;
