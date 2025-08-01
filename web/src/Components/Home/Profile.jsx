import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Profile.css";
import BookCalendar from "./BookCalendar";

import AdminReports from "./AdminReports";
import "./AdminReports.css";
import MonthlyGoalStats from "./MonthlyGoalStats";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("activity");
    const [userReviews, setUserReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [reservedBooks, setReservedBooks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allBooks, setAllBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);

    // Nuevos estados para infracciones y deuda
    const [userDebt, setUserDebt] = useState(0);
    const [userInfractions, setUserInfractions] = useState(0);
    const [loadingInfractions, setLoadingInfractions] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = storedUser?.role?.toLowerCase() === "admin";

    useEffect(() => {
        if (location.state?.openReviews) {
            setActiveTab("reviews");
        }
    }, [location]);

    const [calendarEvents, setCalendarEvents] = useState([]);

    // Función para obtener información de infracciones y deuda del usuario
    const fetchUserInfractionData = async () => {
        if (!authToken) return;

        setLoadingInfractions(true);
        try {
            // Usar el nuevo endpoint específico para datos del perfil
            const res = await fetch(`http://localhost:8080/user/profile-data`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const profileData = await res.json();
                setUserDebt(profileData.debt || 0);
                setUserInfractions(profileData.infractionCount || 0);
                console.log("Profile data loaded:", profileData);
            } else {
                console.error("Error fetching profile data:", res.status);
            }

        } catch (err) {
            console.error('Error fetching user infraction data:', err);
        } finally {
            setLoadingInfractions(false);
        }
    };

    const fetchBooks = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Token o usuario no encontrado');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/books', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data = await res.json();
            setAllBooks(data);
            setReadBooks(data.filter((b) => b.status === 'read'));
            setReservedBooks(data.filter((b) => b.status === 'reserved'));
        } catch (err) {
            console.error(err);
            setError('Error al obtener los libros.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
        // Cargar datos de infracciones cuando el componente se monta
        fetchUserInfractionData();
    }, []);

    // Load user reviews when "Reviews & Ratings" tab is active
    useEffect(() => {
        if (activeTab === "reviews") {
            fetchUserReviews();
        }
    }, [activeTab]);

    const fetchUserReviews = () => {
        fetch("http://localhost:8080/api/reviews/me", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener reviews");
                return res.json();
            })
            .then(data => {
                console.log("Reviews data:", data);
                const validReviews = data.filter(r => r.bookTitle);
                setUserReviews(validReviews);
            })
            .catch(console.error);
    };

    // Edit handlers
    const startEditing = (review) => {
        setEditingReviewId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const cancelEditing = () => {
        setEditingReviewId(null);
        setEditRating(0);
        setEditComment("");
    };

    const saveReview = (reviewId) => {
        fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ rating: editRating, comment: editComment }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al actualizar review");
                return res.json();
            })
            .then(() => {
                cancelEditing();
                fetchUserReviews();
            })
            .catch(console.error);
    };

    const deleteReview = (reviewId) => {
        if (!window.confirm("¿Querés eliminar esta reseña?")) return;
        fetch(`http://localhost:8080/api/reviews/${reviewId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al eliminar review");
                fetchUserReviews();
            })
            .catch(console.error);
    };

    const fetchReservedBooks = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No se encontró el token de autenticación.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/reservations/get', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data = await res.json();
            setReservedBooks(data);
        } catch (err) {
            console.error(err);
            setError('Error al obtener los libros reservados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (allBooks.length > 0) {
            fetchReservedBooks();
        }
    }, [allBooks]);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        console.log("useEffect para cargar reseñas iniciado");
        if (authToken) {
            fetch("http://localhost:8080/api/reviews/me", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    console.log("Respuesta reviews recibida con status:", res.status);
                    if (!res.ok) throw new Error(`Error ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    console.log("Reviews data:", data);
                    const validReviews = data.filter(r => r.bookTitle);
                    setUserReviews(validReviews);
                })
                .catch(err => console.error("Error fetching reviews:", err));
        }
    }, []);

    useEffect(() => {
        console.log("Reserved books:", reservedBooks);
    }, [reservedBooks]);

    useEffect(() => {
        if (reservedBooks.length > 0) {
            console.log("Preparando eventos para el calendario con estas reservas:", reservedBooks);

            reservedBooks.forEach((r, i) => {
                console.log(`Reserva ${i + 1}:`, r);
                console.log("  copy:", r.copy);
                console.log("  book:", r.copy?.book);
                console.log("  título:", r.copy?.book?.title);
            });

            const events = reservedBooks.map(r => {
                const start = new Date(r.pickupDate[0], r.pickupDate[1] - 1, r.pickupDate[2]);
                const endDate = new Date(r.returnDate[0], r.returnDate[1] - 1, r.returnDate[2]);

                endDate.setDate(endDate.getDate() + 1);

                return {
                    title: r.copy?.book?.title,
                    start,
                    end: endDate,
                    allDay: true,
                };
            });

            console.log("Eventos generados para el calendario:", events);
            setCalendarEvents(events);
        } else {
            setCalendarEvents([]);
        }
    }, [reservedBooks]);

    return (
        <div className="profile-container">
            <div className="barra-superior-profile">
                <h1 className="home-title">Profile</h1>
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
                    <button
                        className={activeTab === "goals" ? "tab active" : "tab"}
                        onClick={() => setActiveTab("goals")}
                    >
                        Reading Goals
                    </button>
                </div>
            </div>

            <div className="tab-content">
                {activeTab === "about" && (
                    <div className="fixed-user-info">
                        <button
                            type="button"
                            className="edit-profile-button"
                            onClick={() => navigate("/editProfile")}
                        >
                            Edit Profile
                        </button>
                        <h1 className="username">{storedUser?.name}</h1>
                        <div className="user-detail-row">
                            <span>Email:</span> <span>{storedUser?.email}</span>
                        </div>
                        <div className="user-detail-row">
                            <span>Username:</span> <span>{storedUser?.username}</span>
                        </div>
                        <div className="user-detail-row editable">
                            <span>Password:</span> <span>{storedUser?.password}</span>
                        </div>
                        <div className="user-detail-row">
                            <span>Birth date:</span> <span>{storedUser?.birthDate}</span>
                        </div>
                        <div className="user-detail-row editable">
                            <span>Interests:</span>{" "}
                            <span>
                                {storedUser?.interests
                                    ? storedUser.interests.map((i) => i.genreType).join(", ")
                                    : ""}
                            </span>
                        </div>
                    </div>
                )}

                {activeTab === "activity" && (
                    <div className="activity-section">
                        {isAdmin ? (
                            <>
                                <AdminReports />
                            </>
                        ) : (
                            <>
                                <div className="reservados">
                                    <h2 className="reservados-title">Reserved Books</h2>
                                    <div className="carousel-container">
                                        <div className="reservados-carousel">
                                            {reservedBooks.length === 0 ? (
                                                <div className="empty-state">
                                                    <div className="empty-state-icon">📚</div>
                                                    <p className="empty-state-text">No reserved books currently.</p>
                                                    <p style={{ fontSize: '0.9rem', color: '#999', margin: 0 }}>
                                                        Browse our catalog to reserve your next great read!
                                                    </p>
                                                </div>
                                            ) : (
                                                reservedBooks.map((book) => {
                                                    console.log("Libro renderizado:", book);

                                                    return (
                                                        <div
                                                            key={book.id}
                                                            className="reserved-book-card"
                                                            onClick={() => navigate(`/bookDetails/${book.id}`)}
                                                        >
                                                            <img
                                                                src={book.book.imageUrl}
                                                                alt={book.book.title}
                                                                onError={(e) => {
                                                                    console.error("Error loading image for book:", book.title);
                                                                    e.target.src = '/placeholder-book.png'; // Imagen de fallback
                                                                }}
                                                            />
                                                            <p>{book.book.title}</p>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                        {reservedBooks.length > 3 && (
                                            <div className="scroll-indicator">→</div>
                                        )}
                                    </div>
                                </div>

                                <div className="lower-activity-section">
                                    <div className="calendario">
                                        <BookCalendar events={calendarEvents} />
                                    </div>
                                    <div className="account-status-container">
                                        <h2 className="status-section-title">Account Status</h2>
                                        <div className="status-cards">
                                            <div className={`status-card debt-card ${userDebt > 0 ? 'has-debt' : 'no-debt'}`}>
                                                <div className="status-icon">
                                                    {userDebt > 0 ? '💳' : '✅'}
                                                </div>
                                                <div className="status-content">
                                                    <h3>Outstanding Debt</h3>
                                                    {loadingInfractions ? (
                                                        <div className="loading-spinner">Loading...</div>
                                                    ) : (
                                                        <div className="status-value">
                                                            <span className="currency">$</span>
                                                            <span className="amount">{userDebt}</span>
                                                        </div>
                                                    )}
                                                    <p className="status-description">
                                                        {userDebt > 0 ? 'Please settle your outstanding balance' : 'All clear!'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={`status-card infractions-card ${userInfractions > 0 ? 'has-infractions' : 'no-infractions'}`}>
                                                <div className="status-icon">
                                                    {userInfractions > 0 ? '⚠️' : '🛡️'}
                                                </div>
                                                <div className="status-content">
                                                    <h3>Infractions</h3>
                                                    {loadingInfractions ? (
                                                        <div className="loading-spinner">Loading...</div>
                                                    ) : (
                                                        <div className="status-value">
                                                            <span className="count">{userInfractions}</span>
                                                            <span className="unit">{userInfractions === 1 ? 'infraction' : 'infractions'}</span>
                                                        </div>
                                                    )}
                                                    <p className="status-description">
                                                        {userInfractions === 0 ? 'Perfect record!' :
                                                            userInfractions === 1 ? 'Minor issue recorded' :
                                                                'Multiple issues recorded'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}


                {activeTab === "reviews" && (
                    <div className="reviews-section">
                        <h2>Mis reseñas</h2>
                        {userReviews.length === 0 ? (
                            <p>No tenés reseñas todavía.</p>
                        ) : (
                            userReviews.map((review) => (
                                <div className="review" key={review.id}>
                                    {editingReviewId === review.id ? (
                                        <div className="review-content">
                                            <strong>{review.bookTitle}</strong>
                                            <label>
                                                Rating:{" "}
                                                <select
                                                    value={editRating}
                                                    onChange={(e) => setEditRating(Number(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5].map((n) => (
                                                        <option key={n} value={n}>
                                                            {n}
                                                        </option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Comentario:
                                                <textarea
                                                    rows={3}
                                                    value={editComment}
                                                    onChange={(e) => setEditComment(e.target.value)}
                                                />
                                            </label>
                                            <div className="review-actions">
                                                <button onClick={() => saveReview(review.id)}>Guardar</button>
                                                <button onClick={cancelEditing}>Cancelar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="review-content">
                                                <strong>{review.bookTitle}</strong>
                                                <p>
                                                    {"⭐".repeat(review.rating)} – {review.comment}
                                                </p>
                                            </div>
                                            <div className="review-actions">
                                                <button
                                                    onClick={() => startEditing(review)}
                                                    className="icon-button edit"
                                                    aria-label="Editar reseña"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => deleteReview(review.id)}
                                                    className="icon-button delete"
                                                    aria-label="Eliminar reseña"
                                                    title="Eliminar"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === "goals" && (
                    <div className="goals-section">
                        <MonthlyGoalStats />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;