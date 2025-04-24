import React from "react";
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
          />
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
