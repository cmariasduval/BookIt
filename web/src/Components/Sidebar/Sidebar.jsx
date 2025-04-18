import { NavLink } from "react-router-dom";
import { FaSearch, FaHeart, FaBars, FaUser } from "react-icons/fa";
import { ImBooks } from "react-icons/im";
import { MdLogout } from "react-icons/md";
import bookit from "../Assets/bookit.png";
import './Sidebar.css';
import React from 'react';

const Sidebar = () => {
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

            <li>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <FaHeart size={24} />
                <span className="favorites-item">Favorites</span>
              </NavLink>
            </li>

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

            <li>
              <NavLink
                to="/logout"
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
