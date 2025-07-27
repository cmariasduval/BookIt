import React, { useEffect, useState } from 'react';
import './ManageInfractions.css';

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
        } catch (err) {
            console.error('Error al desbloquear:', err);
            setError('Error al desbloquear el usuario.');
        }
    };

    if (loading) return <div className="infractions-container"><p className="loading-text">Cargando infracciones...</p></div>;
    if (error) return <div className="infractions-container"><p className="error-text">{error}</p></div>;

    return (
        <div className="infractions-container">
            <h1 className="title">Gestión de Infracciones</h1>

            {usersWithDebt.length > 0 ? (
                <div className="card">
                    <table className="infractions-table">
                        <thead className="table-header">
                        <tr>
                            <th>Usuario</th>
                            <th>Estado</th>
                            <th>Deuda</th>
                            <th>Infracciones</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersWithDebt.map(user => (
                            <tr key={user.username} className="table-row">
                                <td>
                                    <div className="user-info">
                                            <span className="username">
                                                {user.username || 'Usuario desconocido'}
                                            </span>
                                    </div>
                                </td>
                                <td>
                                        <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                                            {user.blocked ? 'Bloqueado' : 'Activo'}
                                        </span>
                                </td>
                                <td>
                                        <span className={`debt-info ${user.debt > 0 ? 'has-debt' : ''}`}>
                                            ${user.debt.toFixed(2)}
                                        </span>
                                </td>
                                <td>
                                        <span className="debt-info">
                                            {user.infractionCount}
                                        </span>
                                </td>
                                <td>
                                    <div className="button-group">
                                        <button
                                            onClick={() => handlePayDebt(user.username)}
                                            disabled={updatingUsername === user.username || user.debt === 0}
                                            className={`btn btn-primary ${(updatingUsername === user.username || user.debt === 0) ? 'disabled' : ''}`}
                                        >
                                            {updatingUsername === user.username ? 'Actualizando...' : 'Pagar deuda'}
                                        </button>

                                        {!user.blocked && (
                                            <button
                                                onClick={() => openModal('block', user)}
                                                className="btn btn-danger"
                                            >
                                                Bloquear
                                            </button>
                                        )}

                                        {user.blocked && (
                                            <button
                                                onClick={() => openModal('unblock', user)}
                                                className="btn btn-success"
                                            >
                                                Desbloquear
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="empty-state">
                    <p>No hay infracciones registradas.</p>
                </div>
            )}

            {modalInfo.isOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="modal-title">Confirmar Acción</h3>
                        <p className="modal-text">
                            ¿Seguro que querés {modalInfo.action === 'block' ? 'bloquear' : 'desbloquear'} a este usuario?
                        </p>
                        <p className="modal-user">
                            {modalInfo.user?.username || 'Usuario'}
                        </p>
                        <div className="modal-buttons">
                            <button
                                onClick={confirmAction}
                                className={`btn ${modalInfo.action === 'block' ? 'btn-danger' : 'btn-success'}`}
                            >
                                Sí, confirmar
                            </button>
                            <button
                                onClick={closeModal}
                                className="btn btn-primary"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageInfractions;