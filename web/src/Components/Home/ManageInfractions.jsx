import React, { useEffect, useState } from 'react';

const ManageInfractions = () => {
    const [usersWithDebt, setUsersWithDebt] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingUsername, setUpdatingUsername] = useState(null);

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

    const handlePayDebt = async (username) => {
        setUpdatingUsername(username);
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            setUpdatingUsername(null);
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/infractions/users/${username}/pay-debt`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            setUsersWithDebt(prev =>
                prev.map(u => u.username === username ? { ...u, debt: 0, infractionCount: 0 } : u)
            );
        } catch (err) {
            console.error(err);
            setError('Error al actualizar la deuda.');
        } finally {
            setUpdatingUsername(null);
        }
    };

    const handleBlockUser = async (username) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/infractions/block/${username}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error(`Error ${res.status}: ${res.statusText}`);
            }
            alert(`Usuario ${username} bloqueado por 90 días.`);
        } catch (err) {
            console.error(err);
            setError('Error al bloquear el usuario.');
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
                        <li key={user.username}>
                            <strong>{user.username || 'Usuario desconocido'}</strong> - Deuda: ${user.debt.toFixed(2)} - Infracciones: {user.infractionCount}
                            <button
                                onClick={() => handlePayDebt(user.username)}
                                disabled={updatingUsername === user.username || user.debt === 0}
                                style={{ marginLeft: '10px' }}
                            >
                                {updatingUsername === user.username ? 'Actualizando...' : 'Pagar deuda'}
                            </button>
                            <button
                                onClick={() => handleBlockUser(user.username)}
                                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                            >
                                Bloquear
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
