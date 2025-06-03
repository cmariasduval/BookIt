import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './SetGoal.css'; // si querés agregar estilos personalizados

function SetGoal() {
    const [bookCount, setBookCount] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("authToken");

    const handleSubmit = async (e) => {
        console.log(user)
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(
                `http://localhost:8080/api/goals/monthly`,
                {
                    bookCount,
                    month,
                    year
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert("¡Objetivo guardado!");
            navigate("/Home");
        } catch (err) {
            const msg = err.response?.data?.message || "Error inesperado al guardar el objetivo.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="set-goal-container">
            <h2>Establecer Objetivo Mensual</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="set-goal-form">

                <input
                    type="number"
                    placeholder="Cantidad de libros"
                    value={bookCount}
                    onChange={(e) => setBookCount(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Mes (1-12)"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Año"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar Objetivo"}
                </button>
            </form>
        </div>
    );
}

export default SetGoal;
