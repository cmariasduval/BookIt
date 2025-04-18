import React from "react";
import "./Home.css";


const Home = () => {
  const recommendedBooks = [
    "the-psychology-of-money.jpg",
    "company-of-one.jpg",
    "how-innovation-works.jpg",
    "the-picture-of-dorian-gray.jpg",
  ];

  const bookCategories = [
    { img: "money.jpg", label: "Money / Investing" },
    { img: "design.jpg", label: "Design" },
    { img: "business.jpg", label: "Business" },
    { img: "self.jpg", label: "Self Improvement" },
  ];

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
              src={`/assets/books/${img}`}
              alt="book"
              className="home-book-card"
            />
          ))}
        </div>
      </div>

      {/* Categorías */}
      <div className="home-section">
        <h2 className="home-section-title">Book Category</h2>
        <button>View All</button>
        <div className="home-category-list">
          {bookCategories.map(({ img, label }, index) => (
            <div key={index} className="home-category-card">
              <img
                src={`/assets/categories/${img}`}
                alt={label}
                className="home-category-image"
              />
              <span className="home-category-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
