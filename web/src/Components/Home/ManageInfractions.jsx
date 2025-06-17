import React, { useEffect, useState } from 'react';

const ManageInfractions = () => {
    const [usersWithDebt, setUsersWithDebt] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingUsername, setUpdatingUsername] = useState(null);
    const [modalInfo, setModalInfo] = useState({ isOpen: false, action: null, user: null });

    const openModal = (action, user) => {
        setModalInfo({ isOpen: true, action, user });
    };

    const closeModal = () => {
        setModalInfo({ isOpen: false, action: null, user: null });
    };

    const confirmAction = async () => {
        const { action, user } = modalInfo;
        if (!user) return;

        if (action === 'block') {
            await handleBlockUser(user.username);
        } else if (action === 'unblock') {
            await handleUnblockUser(user.username);
        }

        closeModal();
    };

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
            const res = await fetch(`http://localhost:8080/api/infractions/pay-debt/${username}`, {
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

            setUsersWithDebt(prev =>
                prev.map(user =>
                    user.username === username ? { ...user, blocked: true } : user
                )
            );
            alert(`Usuario ${username} bloqueado por 90 días.`);
        } catch (err) {
            console.error(err);
            setError('Error al bloquear el usuario.');
        }
    };

    const handleUnblockUser = async (username) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/infractions/unblock/${username}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                const errorBody = await res.text();
                throw new Error(`Error ${res.status}: ${res.statusText} - ${errorBody}`);
            }

            setUsersWithDebt(prev =>
                prev.map(user =>
                    user.username === username ? { ...user, blocked: false } : user
                )
            );
            alert(`Usuario desbloqueado.`);
        } catch (err) {
            console.error('Error al desbloquear:', err);
            setError('Error al desbloquear el usuario.');
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
                            {!user.blocked && (
                                <button
                                    onClick={() => openModal('block', user)}
                                    style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                                >
                                    Bloquear
                                </button>
                            )}

                            {user.blocked && (
                                <button
                                    onClick={() => openModal('unblock', user)}
                                    style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}
                                >
                                    Desbloquear
                                </button>
                            )}

                            {modalInfo.isOpen && modalInfo.user?.username === user.username && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <p>¿Seguro que querés {modalInfo.action === 'block' ? 'bloquear' : 'desbloquear'} a este usuario?</p>
                                        <strong>{modalInfo.user?.username || 'Usuario'}</strong>
                                        <div style={{ marginTop: '10px' }}>
                                            <button onClick={confirmAction} style={{ marginRight: '10px' }}>Sí</button>
                                            <button onClick={closeModal}>Cancelar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
