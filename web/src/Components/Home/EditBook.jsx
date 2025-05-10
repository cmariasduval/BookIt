import "./EditBook.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Select from "react-select";

const EditBook = () => {
    const navigate = useNavigate();
    const { bookId } = useParams();  // Usamos el ID del libro desde la URL
    const [book, setBook] = useState(null);  // Para almacenar los datos del libro
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setISBN] = useState("");
    const [publisher, setPublisher] = useState("");
    const [description, setDescription] = useState("");
    const [copies, setCopies] = useState(1);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState("");
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

    // Cargar el libro para editar cuando se carga el componente
    useEffect(() => {
        fetch(`http://localhost:8080/api/books/${bookId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setBook(data);
                setTitle(data.title);
                setAuthor(data.author);
                setISBN(data.isbn);
                setPublisher(data.publisher);
                setDescription(data.description);
                setCopies(data.copies);
                setGenres(data.genres.map(g => ({ value: g.name, label: g.name })));  // Asumimos que los géneros vienen como un array de objetos con 'name'
                setKeywords(data.keywords);
            })
            .catch((err) => {
                console.error("Error fetching book:", err);
            });
    }, [bookId]);

    const closeModal = () => {
        navigate(-1);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting the form...");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("isbn", isbn);
        formData.append("publisher", publisher);
        formData.append("description", description);
        formData.append("keywords", keywords);
        formData.append("copies", copies);
        formData.append("image", image);

        genres.forEach((g, i) => {
            formData.append(`genres[${i}]`, g.value);
        });

        fetch(`http://localhost:8080/api/books/editBook/${bookId}`, {
            method: "PUT",
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
            }
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to update book');
                }
                return res.json();
            })
            .then((data) => {
                console.log("Book updated:", data);
                closeModal();
            })
            .catch((err) => {
                console.error("Error updating book:", err);
            });
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={closeModal}>×</button>
                <h2>Edit Book</h2>

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
                        value={publisher}
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
                        value={description}
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
                    />

                    <input
                        type="text"
                        placeholder="Keywords (comma separated)"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default EditBook;
