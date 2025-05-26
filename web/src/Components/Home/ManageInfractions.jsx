import React, { useEffect, useState } from 'react';

const ManageInfractions = () => {
    const [infractions, setInfractions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfractions = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('No se encontró el token de autenticación.');
                setLoading(false);
                return;
            }

            try {
                const res = await fetch('http://localhost:8080/api/infractions', {
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
                setInfractions(data);
            } catch (err) {
                console.error(err);
                setError('Error al obtener las infracciones.');
            } finally {
                setLoading(false);
            }
        };

        fetchInfractions();
    }, []);

    if (loading) return <p>Cargando infracciones...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="infractions-container">
            <h1>Gestión de Infracciones</h1>
            {infractions.length > 0 ? (
                <ul>
                    {infractions.map((infraction) => (
                        <li key={infraction.id}>
                            <strong>{infraction.user.name}</strong> - {infraction.reason}
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
