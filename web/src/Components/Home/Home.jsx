import React, { useState, useEffect } from "react";
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

    // Estados de autenticación y búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [token, setToken] = useState("");  // Estado para el token

    // Función para verificar si el token ha expirado
    const checkTokenExpiration = (token) => {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      return exp < currentTime;
  };

  // useEffect para verificar el token al cargar el componente
  useEffect(() => {
      const storedToken = localStorage.getItem("authToken");
      console.log("Token en localStorage:", storedToken);  // Verifica si el token está disponible

      if (storedToken && !checkTokenExpiration(storedToken)) {
          setIsAuthenticated(true); // Si el token es válido
      } else {
          setIsAuthenticated(false); // Si el token no está presente o ha expirado
          localStorage.removeItem("authToken"); // Elimina el token del localStorage si ha expirado
          setAuthError("Sesión expirada. Necesita volver a iniciar sesión.");
      }
  }, []);

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setAuthError(null);

        if (!isAuthenticated) {
            setAuthError('Sesión expirada. Necesita volver a iniciar sesión.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/books/search', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Se pasa el token aquí
                    'Content-Type': 'application/json'
                },
            });

            if (response.status === 401 || response.status === 403) {
                setAuthError('Sesión expirada. Necesita volver a iniciar sesión.');
                setIsAuthenticated(false);
                return;
            }

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            setAuthError('Error al realizar la búsqueda. Intente nuevamente.');
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
                        disabled={!isAuthenticated}
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
