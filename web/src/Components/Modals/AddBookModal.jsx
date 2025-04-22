import React from "react";
import './AddBookModal.css'; // Asegúrate de tener un archivo CSS si deseas darle estilo

const AddBookModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add a New Book</h2>
                {/* Aquí podrías agregar un formulario para agregar un libro */}
                <form>
                    <input type="text" placeholder="Book Title" />
                    <input type="text" placeholder="Author" />
                    <button type="submit">Add Book</button>
                </form>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddBookModal;
