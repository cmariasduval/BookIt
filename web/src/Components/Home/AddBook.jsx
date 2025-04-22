import React, { useState } from 'react';
import './AddBook.css'; // Asegúrate de tener el archivo de estilos CSS

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        publisher: '',
        isbn: '',
        genre: '',
        coverImage: ''
    });

    // Maneja los cambios en cada input del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/books/', {
                method: 'POST', // Método para enviar los datos
                headers: {
                    'Content-Type': 'application/json', // Enviar los datos como JSON
                },
                body: JSON.stringify(formData), // Enviar los datos del formulario
            });

            const data = await response.json(); // Respuesta del servidor
            console.log('Book added:', data); // Mostrar respuesta en consola

            // Limpiar el formulario después de agregar el libro (opcional)
            setFormData({
                title: '',
                author: '',
                description: '',
                publisher: '',
                isbn: '',
                genre: '',
                coverImage: ''
            });

            alert('Book added successfully!'); // Notificar que el libro se agregó
        } catch (error) {
            console.error('Error adding book:', error);
            alert('Error adding book!');
        }
    };

    return (
        <div className="add-book-container">
            <h2>Add a New Book</h2>
            <form onSubmit={handleSubmit} className="add-book-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="publisher">Publisher</label>
                    <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        value={formData.publisher}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="isbn">ISBN</label>
                    <input
                        type="text"
                        id="isbn"
                        name="isbn"
                        value={formData.isbn}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="genre">Genre</label>
                    <input
                        type="text"
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="coverImage">Cover Image URL</label>
                    <input
                        type="text"
                        id="coverImage"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Add Book</button>
            </form>
        </div>
    );
};

export default AddBook;
