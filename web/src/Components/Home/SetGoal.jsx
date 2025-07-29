import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './SetGoal.css';

function SetGoal() {
    const [bookCount, setBookCount] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("authToken");

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post(
                `http://localhost:8080/api/goals/monthly`,
                {
                    bookCount: parseInt(bookCount),
                    month: parseInt(month),
                    year: parseInt(year)
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            navigate("/home");

        } catch (err) {
            const msg = err.response?.data?.message || "Error inesperado al guardar el objetivo.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="set-goal-container">
            <div className="header-section">
                <button
                    className="back-button"
                    onClick={() => navigate("/home")}
                    type="button"
                >
                    ←
                </button>
                <h1>Establecer Objetivo Mensual</h1>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="set-goal-form">
                <div className="form-group">
                    <label htmlFor="bookCount">Número de libros</label>
                    <input
                        id="bookCount"
                        type="number"
                        min="1"
                        max="50"
                        placeholder="¿Cuántos libros quieres leer?"
                        value={bookCount}
                        onChange={(e) => setBookCount(e.target.value)}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="month">Mes</label>
                        <select
                            id="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el mes</option>
                            {monthNames.map((monthName, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {monthName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="year">Año</label>
                        <select
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            required
                        >
                            <option value="">Selecciona el año</option>
                            {years.map(yearOption => (
                                <option key={yearOption} value={yearOption}>
                                    {yearOption}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? "Guardando..." : "Guardar Objetivo"}
                </button>
            </form>
        </div>
    );
}

export default SetGoal;