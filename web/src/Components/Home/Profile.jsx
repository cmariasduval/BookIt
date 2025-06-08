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
import BookCalendar from "./BookCalendar"; 


const Profile = () => {
    const [activeTab, setActiveTab] = useState("activity");
    const [userData, setUserData] = useState(null);
    const [userReviews, setUserReviews] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const userEmail = storedUser?.email;

    useEffect(() => {
        if (userEmail) {
            const yourAuthToken = localStorage.getItem('authToken');
            fetch(`http://localhost:8080/api/users/${userEmail}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${yourAuthToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    return response.json();
                })
                .then(data => setUserData(data))
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [userEmail]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            fetch("http://localhost:8080/api/reviews/me", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error(`Error ${res.status}`);
                    return res.json();
                })
                .then(data => setUserReviews(data))
                .catch(err => console.error("Error fetching reviews:", err));
        }
    }, []);

    const reservedBooks = [bookthief, annafrank, belljar, emma, rebecca, mazerunner, hungergames];

    return (
        <div className="profile-container">
            <div className="barra-superior-profile">
                <h1 className="home-title">Profile</h1>
                <div className="tabs-container">
                    <button className={activeTab === "about" ? "tab active" : "tab"} onClick={() => setActiveTab("about")}>About me</button>
                    <button className={activeTab === "activity" ? "tab active" : "tab"} onClick={() => setActiveTab("activity")}>My Activity</button>
                    <button className={activeTab === "reviews" ? "tab active" : "tab"} onClick={() => setActiveTab("reviews")}>Reviews & Ratings</button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === "activity" && (
                    <div className="activity-section">
                        <div className="reservados">
                            <h2 className="reservados-title">Reserved Books</h2>
                            <div className="reservados-carousel">
                                {reservedBooks.map((img, index) => (
                                    <img key={index} src={img} alt="book" className="reserved-book-card" onClick={() => navigate('/bookDetails')} />
                                ))}
                            </div>
                        </div>
                        <div className="lower-activity-section">
                            
                            <div className="calendario">
                                <BookCalendar />
                            </div>
                            <div className="infracciones-container">
                                <div className="infracciones"><h2>Deuda</h2><p>$2000</p></div>
                                <div className="infracciones"><h2>Infracciones</h2><p>2</p></div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "reviews" && (
                    <div className="reviews-section">
                        <h2>Mis reseñas</h2>
                        {userReviews.length === 0 ? (
                            <p>No tenés reseñas todavía.</p>
                        ) : (
                            userReviews.map(review => (
                                <div className="review" key={review.id}>
                                    <strong>{review.book.title}</strong>
                                    <p>{"⭐".repeat(review.rating)} – {review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "about" && (
                    <div className="fixed-user-info">
                        <button type="button" className="edit-profile-button" onClick={() => navigate("/editProfile")}>Edit Profile</button>
                        <h1 className="username">{storedUser.name}</h1>
                        <div className="user-detail-row"><span>Email:</span><span>{storedUser.email}</span></div>
                        <div className="user-detail-row"><span>Username:</span><span>{storedUser.username}</span></div>
                        <div className="user-detail-row editable"><span>Password:</span><span>{storedUser.password}</span></div>
                        <div className="user-detail-row"><span>Birth date:</span><span>{storedUser.birthDate}</span></div>
                        <div className="user-detail-row editable"><span>Interests:</span><span>{storedUser.interests.map(i => i.genreType).join(', ')}</span></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
