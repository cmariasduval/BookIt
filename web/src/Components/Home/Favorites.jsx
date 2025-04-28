import React, { useEffect, useState } from 'react';
import './Favorites.css';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    // Función para obtener los favoritos desde la API
    useEffect(() => {
        fetch('http://localhost:8080/api/favorites')  // Aquí debes poner la URL correcta para obtener los favoritos
            .then(response => response.json())
            .then(data => setFavorites(data))
            .catch(error => console.error('Error fetching favorites:', error));
    }, []);

    // Función para eliminar un libro de los favoritos
    const handleRemoveFavorite = (bookId) => {
        fetch(`http://localhost:8080/api/favorites/${bookId}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Actualizar la lista de favoritos después de eliminar un libro
                setFavorites(favorites.filter(favorite => favorite.bookId !== bookId));
            })
            .catch(error => console.error('Error removing favorite:', error));
    };

    return (
        <div className="favorites-container">
            <h1>Mis Favoritos</h1>

            {/* Mostrar la lista de favoritos */}
            {favorites.length > 0 ? (
                <ul>
                    {favorites.map(favorite => (
                        <li key={favorite.bookId} className="favorite-item">
                            <div className="favorite-info">
                                <h3>{favorite.bookTitle}</h3>
                                <img src={favorite.bookImage} alt={favorite.bookTitle} className="favorite-image" />
                            </div>
                            <button
                                className="remove-favorite-button"
                                onClick={() => handleRemoveFavorite(favorite.bookId)}
                            >
                                Eliminar de favoritos
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes libros favoritos.</p>
            )}
        </div>
    );
};

export default Favorites;
