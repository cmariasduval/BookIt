import React from "react";
import './AddBookModal.css'; // Asegúrate de tener un archivo CSS si deseas darle estilo

const AddBookModal = ({ onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add a New Book</h2>
                {/* Aquí podrías agregar un formulario para agregar un libro */}
                <form>
                    <input type="text" placeholder="Book Title"/>
                    <input type="text" placeholder="Author"/>
                    <input type="text" placeholder="ISBN"/>
                    <input type="text" placeholder="Editorial"/>
                    <input type="text" placeholder="Image URL"/>
                </form>
                <button type="submit"> Add Book</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddBookModal;
