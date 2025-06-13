import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import BookCalendar from "./BookCalendar";

const Profile = () => {
    const [activeTab, setActiveTab] = useState("activity");
    const [userReviews, setUserReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");
    const [reservedBooks, setReservedBooks] = useState([]);
    const [userData, setUserData] = useState(null);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const authToken = localStorage.getItem("authToken");
    const navigate = useNavigate();

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
            .then(setUserReviews)
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
    console.log("storedUser:", storedUser);
  const userEmail = storedUser.email;
  const userId = storedUser.id

  useEffect(() => {
  const fetchReservedBooks = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("authToken");

      const reservedBooksUrl = `http://localhost:8080/api/users/${userEmail}/active-reservations`;

      const response = await fetch(reservedBooksUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reserved books");
      }

      const data = await response.json();

      // ⬇️ Acá va el log
      console.log("Reserved books data:", data);

      setReservedBooks(data);
    } catch (error) {
      console.error("Error fetching reserved books:", error);
    }
  };

  fetchReservedBooks();
}, []);


  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    console.log("useEffect para cargar reseñas iniciado"); // LOG
    if (authToken) {
      fetch("http://localhost:8080/api/reviews/me", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log("Respuesta reviews recibida con status:", res.status); // LOG
          if (!res.ok) throw new Error(`Error ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log("Reviews data:", data); // LOG
          setUserReviews(data);
        })
        .catch(err => console.error("Error fetching reviews:", err));
    }
  }, []);

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
                        <div className="reservados">
                            <h2 className="reservados-title">Reserved Books</h2>
                            <div className="reservados-carousel">
                                {reservedBooks.length === 0 ? (
                                    <p>No reserved books currently.</p>
                                    ) : (
                                    reservedBooks.map((book) => (
                                        <div
                                        key={book.id}
                                        className="reserved-book-card"
                                        onClick={() => navigate(`/bookDetails/${book.id}`)}
                                        style={{ cursor: "pointer" }}
                                        >
                                        <img src={book.imageUrl} alt={book.title} />
                                        <p>{book.title}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="lower-activity-section">
                            <div className="calendario">
                                <BookCalendar />
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
                            userReviews.map((review) => (
                                <div className="review" key={review.id}>
                                    {editingReviewId === review.id ? (
                                        <div className="review-content">
                                            <strong>{review.book.title}</strong>
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
                                                <strong>{review.book.title}</strong>
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
            </div>
        </div>
    );
};

export default Profile;
