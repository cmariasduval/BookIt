import { useState } from "react";
import "./Profile.css";
import { LuPencilLine } from "react-icons/lu";
import bookthief from '../Assets/books/bookthief.png';
import emma from '../Assets/books/emma.png';
import annafrank from '../Assets/books/annafrank.png';
import belljar from '../Assets/books/belljar.png';
import hungergames from '../Assets/books/hungergames.png';
import mazerunner from '../Assets/books/mazerunner.png';
import rebecca from '../Assets/books/rebecca.png';
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("activity");

  const userData = {
    name: "María Gómez",
    email: "maria@gmail.com",
    username: "mariag123",
    birthday: "1998-05-14",
    interests: "Romance, Fantasy"
  };

  const navigate = useNavigate();
  const reservedBooks = [bookthief, annafrank, belljar, emma, rebecca, mazerunner, hungergames];
  return (
    <div className="profile-container">
      {/* Sección fija con los datos del usuario */}
      <h1 className="home-title">Profile</h1>

      {/* Tabs */}
      <div className="tabs-container">
      <button
          className={activeTab === "about" ? "tab active" : "tab"}
          onClick={() => setActiveTab("about")}
        >
          About me
        </button>
        <button
          className={activeTab === "activity" ? "tab active" : "tab"}
          onClick={() => setActiveTab("activity")}
        >
          My Activity
        </button>
        <button
          className={activeTab === "reviews" ? "tab active" : "tab"}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews & Ratings
        </button>
      </div>

      {/* Contenido dinámico */}
      <div className="tab-content">
        {activeTab === "activity" && (
          <div className="activity-section">
            <div className="reservados">
              <h2 className="reservados-title">Reserved Books</h2>
              <div className="reservados-carousel">
                {reservedBooks.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="book"
                    className="reserved-book-card"
                    onClick={() => navigate('/bookDetails')}
                  />
                ))}
              </div>
            </div>

            <div className="infracciones-container">
              <div className="infracciones">
                <h2>Deuda</h2>
                <p>$2000</p>
              </div>
              <div className="infracciones">
                <h2>Infracciones</h2>
                <p>2</p>
              </div>

              <div className="calendario">
              Calendario
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="reviews-section">
            <h2>Mis reseñas</h2>
            <div className="review">
              <strong>“1984”</strong>
              <p>⭐⭐⭐⭐⭐ – Excelente distopía, atrapante desde el inicio.</p>
            </div>
            <div className="review">
              <strong>“Fahrenheit 451”</strong>
              <p>⭐⭐⭐ – Interesante, aunque esperaba más desarrollo de personajes.</p>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="fixed-user-info">
          <h1 className="username">{userData.name}</h1>
          <div className="user-detail-row">
            <span>Email:</span>
            <span>{userData.email}</span>
          </div>
          <div className="user-detail-row">
            <span>Username:</span>
            <span>{userData.username}</span>
          </div>
          <div className="user-detail-row editable">
            <span>Password:</span>
            <span>********</span>
            <LuPencilLine className="edit-icon" size={25} />
          </div>
          <div className="user-detail-row">
            <span>Birth date:</span>
            <span>{userData.birthday}</span>
          </div>
          <div className="user-detail-row editable">
            <span>Interests:</span>
            <span>{userData.interests}</span>
            <LuPencilLine className="edit-icon" size={25} />
          </div>
        </div>
        )}  
      </div>
    </div>
  );
};

export default Profile;
