import './NavBar.css' 
import { IoNotifications } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { useState } from 'react';
import bookit from '../Assets/bookit.png'

export default function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!setIsDropdownOpen);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return <nav className="nav">
        <a href="/" className="bookit">BookIt</a>
        <input
            className="search-input"
            type="text"
            placeholder="Search books..."
        />
        <ul>
            <li className='active'>
            <a href="/notifications">
                <IoNotifications style={{marginRight: "6px"}} />
            </a>
            </li>
            <li className='dropdown' onClick={closeDropdown}>
                <div className='dropdown-toggle' onClick={toggleDropdown}>
                    <FaUserCircle style={{marginRight: "6px", cursor: "pointer"}} />
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