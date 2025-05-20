import "./AddBook.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";

const AddBook = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setISBN] = useState("");
    const [publisher, setPublisher] = useState("");  // Editorial
    const [description, setDescription] = useState("");  // Descripción
    const [copies, setCopies] = useState(1);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState("");  // Palabras clave
    const [image, setImage] = useState(null);

    const genreOptions = [
        { value: "Psychology", label: "Psychology" },
        { value: "Non-Fiction", label: "Non-Fiction" },
        { value: "Fantasy", label: "Fantasy" },
        { value: "Science Fiction", label: "Science Fiction" },
        { value: "Thriller", label: "Thriller" },
        { value: "Mystery", label: "Mystery" },
        { value: "Romance", label: "Romance" },
        { value: "Historical", label: "Historical" },
        { value: "Horror", label: "Horror" },
        { value: "Fiction", label: "Fiction" },
    ];

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            width: '80%',
            marginBottom: '1rem',
            padding: '2px',
            fontSize: '1rem',
            borderRadius: '6px',
            borderColor: '#ccc',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#999',
            },
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: '1rem',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'palegoldenrod',
            borderRadius: '4px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#333',
            fontWeight: 500,
            fontSize: '1rem',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#555',
            ':hover': {
                backgroundColor: '#ccc',
                color: 'black',
            },
        }),
    };

    const closeModal = () => {
        navigate(-1);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting the form...");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("isbn", isbn);
        formData.append("publisher", publisher);  // Incluir editorial
        formData.append("description", description);  // Incluir descripción
        formData.append("keywords", keywords);  // Incluir palabras clave
        formData.append("copies", copies);
        formData.append("image", image);

        genres.forEach((g, i) => {
            formData.append(`genres[${i}]`, g.value);
        });

        fetch("http://localhost:8080/api/books/addBook", {
            method: "POST",
            body: formData,
            headers: {
                'Access-Control-Allow-Origin': '*', 'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
                    //'Content-Type': 'application/json'
            }
    })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to add book');
                }
                return res.json();
            })
            .then((data) => {
                console.log("Book added:", data);
                closeModal();
            })
            .catch((err) => {
                console.error("Error adding book:", err);
            });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={closeModal}>×</button>
                <h2>Add a New Book</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Publisher"
                        value={publisher}  // Editorial
                        onChange={(e) => setPublisher(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="ISBN"
                        value={isbn}
                        onChange={(e) => setISBN(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        value={description}  // Descripción
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        placeholder="Number of Copies"
                        value={copies}
                        min={1}
                        onChange={(e) => setCopies(e.target.value)}
                        required
                    />

                    <Select
                        isMulti
                        options={genreOptions}
                        value={genres}
                        onChange={setGenres}
                        placeholder="Select genres..."
                        styles={customSelectStyles}
                    />

                    <input
                        type="text"
                        placeholder="Keywords (comma separated)"
                        value={keywords}  // Palabras clave
                        onChange={(e) => setKeywords(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Cover Image URL"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        required
                    />

                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
