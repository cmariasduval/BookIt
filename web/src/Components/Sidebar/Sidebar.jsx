import React, { useEffect, useState, useCallback, useMemo } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    FaSearch,
    FaUser,
    FaPlus,
    FaCalendarCheck,
    FaExclamationTriangle,
    FaEnvelope,
} from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { RiPencilFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { FaFolder } from "react-icons/fa";

import axios from "axios";
import bookit from "../Assets/bookit.png";
import "./Sidebar.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Estados
    const [goal, setGoal] = useState(null);
    const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 768);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoización de datos del usuario
    const { user, token, isAdmin } = useMemo(() => {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const authToken = localStorage.getItem("authToken");
        return {
            user: userData,
            token: authToken,
            isAdmin: userData?.role?.toLowerCase() === "admin"
        };
    }, []);

    // Configuración de navegación
    const navigationItems = useMemo(() => [
        {
            path: "/home",
            icon: FaSearch,
            label: "Discover",
            className: "discover-item",
            showForAll: true
        },
        {
            path: "/all-books",
            icon: ImBooks,
            label: "All Books",
            className: "allbooks-item",
            showForAll: true
        },
        {
            path: "/library",
            icon: FaFolder,
            label: "My Library",
            className: "library-item",
            showForAll: !isAdmin
        }
    ], [isAdmin]);

    const adminItems = useMemo(() => [
        {
            path: "/addbook",
            icon: FaPlus,
            label: "Add Book",
            className: "addbook-item",
            state: { background: location }
        },
        {
            path: "/manage",
            icon: FaCalendarCheck,
            label: "Manage Reservation",
            className: "manage-item"
        },
        {
            path: "/manage-infractions",
            icon: FaExclamationTriangle,
            label: "Manage Infractions",
            className: "manage-infractions-item"
        },
        {
            path: "/email-management",
            icon: FaEnvelope,
            label: "Email Management",
            className: "email-management-item"
        }
    ], [location]);

    // Función para obtener el goal mensual
    const fetchGoal = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/goals/monthly`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setGoal(response.data);
        } catch (error) {
            console.error("Error fetching monthly goal:", error);
            setError("Error loading monthly goal");
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Función para incrementar libros leídos
    const incrementBooksRead = useCallback(async () => {
        if (!token || isLoading) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/goals/monthly/increment`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setGoal(response.data);
        } catch (error) {
            console.error("Error incrementing books read:", error);
            setError("Error updating progress");
        } finally {
            setIsLoading(false);
        }
    }, [token, isLoading]);

    // Manejo de logout mejorado
    const handleLogout = useCallback(() => {
        localStorage.clear();
            navigate("/");
    }, [navigate]);

    // Toggle sidebar expansion
    const toggleExpanded = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    // Manejo de redimensionamiento de ventana
    useEffect(() => {
        const handleResize = () => {
            setIsExpanded(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cargar goal al montar el componente
    useEffect(() => {
        fetchGoal();
    }, [fetchGoal]);

    // Componente para elementos de navegación
    const NavigationItem = ({ item, isLast = false }) => (
        <li key={item.path}>
            <NavLink
                to={item.path}
                state={item.state}
                className={({ isActive }) =>
                    `sidebar-link ${isActive ? "active" : ""}`
                }
                title={!isExpanded ? item.label : ""}
            >
                <item.icon size={24} />
                <span className={`${item.className} nav-text`}>
                    {item.label}
                </span>
            </NavLink>
            {isLast && <div className="divider" />}
        </li>
    );

    // Componente para el botón de toggle (removido para mantener diseño original)

    // Componente para la sección de goal
    const GoalSection = () => (
        <div className={`goal ${!isExpanded ? 'goal-collapsed' : ''}`}>
            {isExpanded && (
                <>
                    <h2 className="goal-title">Monthly Goal</h2>
                    <div className="goal-progress">
                        <span className="goal-progress-text">
                            {goal?.booksRead ?? 0} / {goal?.bookCount ?? "—"}
                        </span>
                        <button
                            onClick={incrementBooksRead}
                            className="increment-button"
                            disabled={isLoading}
                            title="Mark book as read"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={() => navigate("/set-goal")}
                        className="goal-button"
                        disabled={isLoading}
                    >
                        Set Goal
                    </button>
                    {error && <span className="goal-error">{error}</span>}
                </>
            )}
        </div>
    );

    if (!user || !token) {
        return null; // No mostrar sidebar si no hay usuario autenticado
    }

    return (
        <div className={`sidebar-container ${isExpanded ? 'expanded' : ''}`}>
            <div className="sidebar-content">
                <div className="sidebar-header">
                    <div className="logo">
                        <img src={bookit} alt="BookIt Logo" className="logo-image" />
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        {/* Elementos principales de navegación */}
                        {navigationItems
                            .filter(item => item.showForAll)
                            .map((item, index, arr) => (
                                <NavigationItem
                                    key={item.path}
                                    item={item}
                                    isLast={index === arr.length - 1}
                                />
                            ))
                        }

                        {/* Elemento de perfil */}
                        <li>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                                title={!isExpanded ? "Profile" : ""}
                            >
                                <FaUser size={24} />
                                <span className="profile-item nav-text">Profile</span>
                            </NavLink>
                        </li>

                        {/* Elementos de administrador */}
                        {isAdmin && (
                            <>
                                <div className="divider" />
                                <li className="admin-section-title">
                                    {isExpanded && <span className="nav-text">Admin Panel</span>}
                                </li>
                                {adminItems.map((item) => (
                                    <NavigationItem key={item.path} item={item} />
                                ))}
                            </>
                        )}

                        {/* Logout */}
                        <div className="divider" />
                        <li onClick={handleLogout} className="logout-item">
                            <div className="sidebar-link logout-link">
                                <MdLogout size={24} />
                                <span className="nav-text">Log Out</span>
                            </div>
                        </li>
                    </ul>

                    {/* Sección de goal */}
                    {!isAdmin && <GoalSection />}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;