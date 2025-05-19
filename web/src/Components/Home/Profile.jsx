import { useState, useEffect } from "react";
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
    const [userData, setUserData] = useState(null);  // Para almacenar la respuesta de la API
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    // Verificar si se obtiene el correo electrónico del usuario
    const userEmail = storedUser?.email;

    // Realizar la solicitud fetch dentro del useEffect
    useEffect(() => {
        if (userEmail) {
            // Aquí obtienes el token de autenticación de donde lo tengas guardado
            const yourAuthToken = localStorage.getItem('authToken'); // O cualquier otro lugar donde lo almacenes

            fetch(`http://localhost:8080/api/users/${userEmail}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${yourAuthToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data); // Aquí manejas la respuesta
                    setUserData(data);  // Guarda los datos en el estado
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        } else {
            console.error("User email is missing");
        }
    }, [userEmail]);  // El useEffect solo se ejecutará si userEmail cambia

    const reservedBooks = [bookthief, annafrank, belljar, emma, rebecca, mazerunner, hungergames];

    return (
        <div className="profile-container">
            <div className="barra-superior-profile">
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
            </div>
            {/* Sección fija con los datos del usuario */}
            
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
                        <button type="button" className="edit-profile-button" onClick={() => navigate("/editProfile")}>Edit Profile</button>
                        <h1 className="username">{storedUser.name}</h1>
                        <div className="user-detail-row">
                            <span>Email:</span>
                            <span>{storedUser.email}</span>
                        </div>
                        <div className="user-detail-row">
                            <span>Username:</span>
                            <span>{storedUser.username}</span>
                        </div>
                        <div className="user-detail-row editable">
                            <span>Password:</span>
                            <span>{storedUser.password}</span>
                        </div>
                        <div className="user-detail-row">
                            <span>Birth date:</span>
                            <span>{storedUser.birthDate}</span>
                        </div>
                        <div className="user-detail-row editable">
                            <span>Interests:</span>
                            <span>{storedUser.interests.map((interest) => interest.genreType).join(', ')}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
