import './NavBar.css' 
import { useNavigate } from "react-router-dom";
import { IoNotifications } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useState } from 'react';
import bookit from '../Assets/bookit.png'

export default function NavBar() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!setIsDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return <nav className="nav">
        <img src={bookit} alt="bookit" className='bookit' />
        <input
            className="search-input"
            type="text"
            placeholder="Search books..."
        />
        <ul className='bar-icons'>
            <li className='notifications'>
                <div className='notifications-div'>
                    <IoNotifications style={{marginRight: "6px"}} />
                </div>
            </li>
            <li className='dropdown' onClick={closeDropdown}>
                <div className='dropdown-toggle' onClick={toggleDropdown}>
                    <FaUserCircle style={{cursor: "pointer"}} />
                </div>
                {isDropdownOpen && (
                    <div className='dropdown-menu'>
                        <a href='/profile'>Profile</a>
                        <a href='/'>Logout</a>
                    </div>
                )}
            </li>
            
        </ul>
    </nav>
}