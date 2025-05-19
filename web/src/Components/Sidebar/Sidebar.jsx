import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaBars, FaUser, FaPlus, FaCalendarCheck} from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { RiPencilFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import bookit from "../Assets/bookit.png";
import './Sidebar.css';
import React from 'react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role?.toLowerCase() === "admin";

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
                                to="/Home"
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <FaSearch size={24} />
                                <span className="discover-item">Discover</span>
                            </NavLink>
                        </li>

                        {!isAdmin && (
                            <>
                                <li>
                                    <NavLink
                                        to="/library"
                                        className={({ isActive }) =>
                                            `sidebar-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <ImBooks size={24} />
                                        <span className="library-item">My Library</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        

                        <div className="divider"></div>

                        <li>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <FaUser size={24} />
                                <span className="profile-item">Profile</span>
                            </NavLink>
                        </li>

                        {isAdmin && (
                            <>
                                <li>
                                    <NavLink
                                        to="/addbook"
                                        state={{ background: location }}
                                        className={({ isActive }) =>
                                            `sidebar-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <FaPlus size={24} />
                                        <span className="addbook-item">Add Book</span>
                                    </NavLink>
                                </li>

                                {/* Edit Book Button */}
                                <li>
                                    <NavLink
                                        to="/editbook"
                                        state={{ background: location }}
                                        className={({ isActive }) =>
                                            `sidebar-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <RiPencilFill size={24} />
                                        <span className="editbook-item">Edit Book</span>
                                    </NavLink>
                                </li>

                                <li>
                                    <NavLink
                                        to="/manage"
                                        state={{ background: location }}
                                        className={({ isActive }) =>
                                            `sidebar-link ${isActive ? 'active' : ''}`
                                        }
                                    >
                                        <FaCalendarCheck size={24} />
                                        <span className="manage-item">Manage Reservations</span>
                                    </NavLink>
                                </li>
                            </>
                        )}

                        <li onClick={handleLogout}>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `sidebar-link ${isActive ? 'active' : ''}`
                                }
                            >
                                <MdLogout size={24} />
                                <span className="logout-item">Log Out</span>
                            </NavLink>
                        </li>
                    </ul>

                    <div className="goal">
                        <h2 className="goal-title">Monthly Goal</h2>
                        <p className="goal-number">5</p>
                        <button className="goal-button">Set Goal</button>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
