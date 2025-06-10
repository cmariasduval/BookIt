import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import './BookGenres.css';

const BookGenres = () => {
  const { genreName } = useParams();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};


  useEffect(() => {
    const fetchGenreBooks = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No auth token found");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/api/books/genre/${genreName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          setError("Failed to fetch books for this genre");
          return;
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError("No books found for this genre");
      }
    };

    fetchGenreBooks();
  }, [genreName]);

  return (
    <div className="book-genres-container">
        <button type="button" onClick={() => navigate("/home")}>
            <IoMdArrowBack size={24} />
        </button>
        <h1>{capitalizeFirstLetter(genreName.replace(/-/g, " "))} books</h1>


      {error && <p className="error-message">{error}</p>}

      {books.length === 0 && !error && <p>No books found for this genre.</p>}

      <div className="book-list">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => navigate(`/bookDetails/${book.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={book.imageUrl} alt={book.title} />
            <h3>{book.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookGenres;
