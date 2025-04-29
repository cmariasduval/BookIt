import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import bookthief from '../Assets/books/bookthief.png';
import emma from '../Assets/books/emma.png';
import annafrank from '../Assets/books/annafrank.png';
import belljar from '../Assets/books/belljar.png';
import hungergames from '../Assets/books/hungergames.png';
import mazerunner from '../Assets/books/mazerunner.png';
import rebecca from '../Assets/books/rebecca.png';
import { FaBrain } from "react-icons/fa";
import { GiGreekTemple } from "react-icons/gi";
import { FaHeart } from "react-icons/fa";
import { GiMaterialsScience } from "react-icons/gi";
import { FaRegNewspaper } from "react-icons/fa6";
import { GiGhost } from "react-icons/gi";
import { RiKnifeBloodLine } from "react-icons/ri";
import { MdCastle } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const recommendedBooks = [bookthief, annafrank, belljar, emma, rebecca, mazerunner, hungergames];
    const bookCategories = [
        { icon: <FaBrain />, label: "Psychology" },
        { icon: <GiGreekTemple />, label: "History" },
        { icon: <FaHeart />, label: "Romance" },
        { icon: <GiMaterialsScience />, label: "Science Fiction" },
        { icon: <FaRegNewspaper />, label: "Non-Fiction" },
        { icon: <GiGhost />, label: "Horror" },
        { icon: <RiKnifeBloodLine />, label: "Thriller" },
        { icon: <MdCastle />, label: "Fantasy" },
        { icon: <FaMagnifyingGlass />, label: "Mystery" },
    ];
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [authError, setAuthError] = useState(null);
    const debounceTimeout = useRef(null);  // Ref para controlar el debounce

    // Cargar usuario al entrar (si lo necesitas para otras partes de la app)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim() !== "") {
                fetchBooks(searchTerm);
            } else {
                setSearchResults([]);
            }
        }, 300); // esperar 300ms luego de que el usuario deja de tipear

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const fetchBooks = async (query) => {
        try {
            const response = await fetch(`http://localhost:8080/api/books/search?query=${encodeURIComponent(query)}`, {headers:  {Authorization: `Bearer ${localStorage.getItem("authToken")}`}});
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                console.error("Error al buscar libros");
                setAuthError("Search failed");
            }
        } catch (error) {
            console.error("Error en el fetch:", error);
            setAuthError("Network error");
        }
    };

    return (
        <div className="home-container">
            {/* Header con título y buscador */}
            <div className="home-header">
                <h1 className="home-title">Discover</h1>
                <div className="home-search-bar">
                    <select className="home-category-select">
                        <option>All Categories</option>
                        <option>Fantasy</option>
                        <option>Romance</option>
                        <option>Sci-Fi</option>
                        <option>Mystery</option>
                        <option>Non-Fiction</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search book"
                        className="home-search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    {authError && (
                        <div className="auth-error-message">
                            {authError}
                        </div>
                    )}
                    {searchResults.length > 0 && (
                        <ul className="home-search-results">
                            {searchResults.map((book) => (
                                <li
                                    key={book.id}
                                    onClick={() => navigate(`/bookDetails/${book.id}`)}
                                    className="home-search-result-item"
                                >
                                    {book.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Carrusel de recomendaciones */}
            <div className="home-section">
                <h2 className="home-section-title">Recommendations</h2>
                <div className="home-carousel">
                    {recommendedBooks.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt="book"
                            className="home-book-card"
                            onClick={() => navigate('/bookDetails')}
                        />
                    ))}
                </div>
            </div>

            {/* Categorías */}
            <div className="home-section">
                <div className="home-section-header">
                    <h2 className="home-section-title">Book Category</h2>
                    <button className="home-view-all-btn">View All</button>
                </div>
                <div className="home-category-list">
                    {bookCategories.map(({ icon, label }, index) => (
                        <div key={index} className="home-category-card">
                            <div className="home-category-icon">{icon}</div>
                            <span className="home-category-label">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
