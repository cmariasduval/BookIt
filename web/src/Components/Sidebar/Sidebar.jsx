import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
    FaSearch,
    FaUser,
    FaPlus,
    FaCalendarCheck,
    FaExclamationTriangle,
    FaEnvelope, // Importar ícono de email
} from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { RiPencilFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import { FaFolder } from "react-icons/fa";

import axios from "axios";
import bookit from "../Assets/bookit.png";
import "./Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("authToken");
    const isAdmin = user?.role?.toLowerCase() === "admin";

    const [goal, setGoal] = useState(null);

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/goals/monthly", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGoal(response.data);
            } catch (error) {
                console.error("Error fetching monthly goal:", error);
            }
        };

        fetchGoal();
    }, [token]);

    const incrementBooksRead = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8080/api/goals/monthly/increment",
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
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="sidebar-container">
            <div className="bookit">
                <div className="logo">
                    <img src={bookit} alt="bookit" className="bookit" />
                </div>

                <nav className="bar-items">
                    <ul>
                        <li>
                            <NavLink
                                to="/home"
                                className={({isActive}) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                            >
                                <FaSearch size={24}/>
                                <span className="discover-item">Discover</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/all-books"
                                className={({isActive}) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                            >
                                <ImBooks size={24}/>
                                <span className="allbooks-item">All Books</span>
                            </NavLink>
                        </li>

                        {!isAdmin && (
                            <li>
                                <NavLink
                                    to="/library"
                                    className={({isActive}) =>
                                        `sidebar-link ${isActive ? "active" : ""}`
                                    }
                                >
                                    <FaFolder size={24}/>
                                    <span className="library-item">My Library</span>
                                </NavLink>
                            </li>
                        )}

                        <div className="divider"></div>

                        <li>
                            <NavLink
                                to="/profile"
                                className={({isActive}) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                            >
                                <FaUser size={24}/>
                                <span className="profile-item">Profile</span>
                            </NavLink>
                        </li>

                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink
                                        to="/addbook"
                                        state={{background: location}}
                                        className={({isActive}) =>
                                            `sidebar-link ${isActive ? "active" : ""}`
                                        }
                                    >
                                        <FaPlus size={24}/>
                                        <span className="addbook-item">Add Book</span>
                                    </NavLink>
                                </li>

                                <li>
                                    {/*<NavLink*/}
                                    {/*    to="/editbook"*/}
                                    {/*    state={{ background: location }}*/}
                                    {/*    className={({ isActive }) =>*/}
                                    {/*        `sidebar-link ${isActive ? "active" : ""}`*/}
                                    {/*    }*/}
                                    {/*>*/}
                                    {/*    <RiPencilFill size={24} />*/}
                                    {/*    <span className="editbook-item">Edit Book</span>*/}
                                    {/*</NavLink>*/}
                                </li>

                                <li>
                                    <NavLink
                                        to="/manage"
                                        className={({isActive}) =>
                                            `sidebar-link ${isActive ? "active" : ""}`
                                        }
                                    >
                                        <FaCalendarCheck size={24}/>
                                        <span className="manage-item">Manage Reservation</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/manage-infractions"
                                        className={({isActive}) =>
                                            `sidebar-link ${isActive ? "active" : ""}`
                                        }
                                    >
                                        <FaExclamationTriangle size={24}/>
                                        <span className="manage-infractions-item">Manage Infractions</span>
                                    </NavLink>
                                </li>

                                {/* Nueva ruta para gestión de emails */}
                                <li>
                                    <NavLink
                                        to="/email-management"
                                        className={({isActive}) =>
                                            `sidebar-link ${isActive ? "active" : ""}`
                                        }
                                    >
                                        <FaEnvelope size={24}/>
                                        <span className="email-management-item">Email Management</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        <li onClick={handleLogout}>
                            <NavLink
                                to="/"
                                className={({isActive}) =>
                                    `sidebar-link ${isActive ? "active" : ""}`
                                }
                            >
                                <MdLogout size={24}/>
                                <span className="logout-item">Log Out</span>
                            </NavLink>
                        </li>
                    </ul>

                    <div className="goal">
                        <h2 className="goal-title">Monthly Goal</h2>
                        <div className="goal-progress">
                            <span className="goal-progress-text">
                                {goal?.booksRead ?? 0} / {goal?.bookCount ?? "—"}
                            </span>
                            <button onClick={incrementBooksRead} className="increment-button">
                                +
                            </button>
                        </div>
                        <button onClick={() => navigate("/set-goal")} className="goal-button">
                            Set Goal
                        </button>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;