import "./AddBook.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";

const AddBook = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setISBN] = useState("");
    const [publisher, setPublisher] = useState("");
    const [description, setDescription] = useState("");
    const [copies, setCopies] = useState(1);
    const [genres, setGenres] = useState([]);
    const [keywords, setKeywords] = useState("");
    const [image, setImage] = useState("");
    const [batchFile, setBatchFile] = useState(null);
    const [isBatchMode, setIsBatchMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        control: (provided, state) => ({
            ...provided,
            width: '100%',
            marginBottom: '0.6rem',
            padding: '2px',
            fontSize: '0.95rem',
            borderRadius: '12px',
            border: '2px solid #e1e5e9',
            background: 'linear-gradient(145deg, #ffffff, #fafbfc)',
            boxShadow: state.isFocused
                ? 'inset 0 2px 4px rgba(0, 0, 0, 0.02), 0 0 0 3px rgba(238, 232, 170, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)'
                : 'inset 0 2px 4px rgba(0, 0, 0, 0.02)',
            borderColor: state.isFocused ? 'palegoldenrod' : '#e1e5e9',
            '&:hover': {
                borderColor: '#d1d5db',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02), 0 2px 8px rgba(0, 0, 0, 0.08)',
            },
            minHeight: '44px',
            transition: 'all 0.3s ease',
            transform: state.isFocused ? 'translateY(-1px)' : 'translateY(0)',
        }),
        menu: (provided) => ({
            ...provided,
            fontSize: '0.95rem',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(0, 0, 0, 0.1)',
        }),
        menuList: (provided) => ({
            ...provided,
            padding: '0.5rem 0',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'palegoldenrod'
                : state.isFocused
                    ? 'rgba(238, 232, 170, 0.2)'
                    : 'transparent',
            color: state.isSelected ? '#654321' : '#333',
            padding: '0.65rem 1rem',
            cursor: 'pointer',
            '&:active': {
                backgroundColor: 'palegoldenrod',
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'palegoldenrod',
            borderRadius: '8px',
            border: '1px solid goldenrod',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#654321',
            fontWeight: 500,
            fontSize: '0.85rem',
            padding: '0.2rem 0.4rem',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#654321',
            cursor: 'pointer',
            borderRadius: '0 8px 8px 0',
            ':hover': {
                backgroundColor: 'goldenrod',
                color: '#333',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#9ca3af',
            fontSize: '0.95rem',
        }),
    };

    const closeModal = () => {
        navigate(-1);
    };

    const getAuthToken = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            return null;
        }
        return token;
    };

    const handleSingleSubmit = async (e) => {
        e.preventDefault();

        const token = getAuthToken();
        if (!token) return;

        setIsLoading(true);

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

        try {
            const response = await fetch("http://localhost:8080/api/books/addBook", {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                }
                const errorText = await response.text();
                throw new Error(`Failed to add book: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            alert("Book added successfully!");
            closeModal();
        } catch (err) {
            console.error("Error adding book:", err);
            alert(`Error adding book: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBatchSubmit = async (e) => {
        e.preventDefault();

        if (!batchFile) {
            alert("Please upload a .json file.");
            return;
        }

        const token = getAuthToken();
        if (!token) return;

        const extension = batchFile.name.split('.').pop().toLowerCase();
        if (extension !== "json") {
            alert("File must be .json");
            return;
        }

        setIsLoading(true);

        try {
            const fileContent = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(batchFile);
            });

            let jsonContent;
            try {
                jsonContent = JSON.parse(fileContent);
            } catch (parseError) {
                throw new Error("Invalid JSON file format");
            }

            if (!Array.isArray(jsonContent)) {
                throw new Error("JSON file must contain an array of books");
            }

            const response = await fetch("http://localhost:8080/api/books/batch-upload/json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(jsonContent),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                }

                let errorMessage = `Request failed with status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = `${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (data.success) {
                alert(`Batch upload successful! ${data.successful} books uploaded out of ${data.total}.`);
                closeModal();
            } else {
                let message = data.message || "Batch upload completed with issues";
                if (data.errors && data.errors.length > 0) {
                    message += "\n\nErrors:\n" + data.errors.slice(0, 10).join("\n");
                    if (data.errors.length > 10) {
                        message += `\n... and ${data.errors.length - 10} more errors`;
                    }
                }
                alert(message);
            }

        } catch (error) {
            console.error("Error uploading batch:", error);
            alert(`Error uploading batch: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={closeModal} disabled={isLoading}>×</button>
                <h2 style={{
                    marginBottom: '1.2rem',
                    fontSize: '1.6rem',
                    fontWeight: '700',
                    color: '#333',
                    paddingRight: '3rem'
                }}>
                    {isBatchMode ? "Upload Books (Batch)" : "Add a New Book"}
                </h2>

                <div className="mode-switcher">
                    <button
                        type="button"
                        onClick={() => setIsBatchMode(false)}
                        className={!isBatchMode ? "active" : ""}
                        disabled={isLoading}
                    >
                        Single
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsBatchMode(true)}
                        className={isBatchMode ? "active" : ""}
                        disabled={isLoading}
                    >
                        Batch
                    </button>
                </div>

                {isLoading && (
                    <div style={{
                        textAlign: 'center',
                        margin: '0.8rem 0',
                        padding: '0.8rem',
                        background: 'linear-gradient(145deg, #f0f8ff, #e6f3ff)',
                        borderRadius: '12px',
                        color: '#4A90E2',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        <p>Processing... Please wait.</p>
                    </div>
                )}

                {isBatchMode ? (
                    <form onSubmit={handleBatchSubmit}>
                        <div style={{ marginBottom: '0.8rem' }}>
                            <label
                                htmlFor="batch-file"
                                style={{
                                    display: 'block',
                                    marginBottom: '0.4rem',
                                    fontWeight: '600',
                                    color: '#333',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Choose JSON file:
                            </label>
                            <input
                                id="batch-file"
                                type="file"
                                accept=".json"
                                onChange={(e) => setBatchFile(e.target.files[0])}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div style={{
                            marginBottom: '1.2rem',
                            fontSize: '0.85rem',
                            color: '#666',
                            background: '#f8f9fa',
                            padding: '0.8rem',
                            borderRadius: '12px',
                            border: '1px solid #e1e5e9'
                        }}>
                            <p style={{ fontWeight: '600', marginBottom: '0.4rem' }}>
                                <strong>JSON Format Example:</strong>
                            </p>
                            <pre style={{
                                background: '#ffffff',
                                padding: '0.6rem',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                lineHeight: '1.3',
                                overflow: 'auto',
                                border: '1px solid #e1e5e9'
                            }}>
{`[
  {
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "1234567890",
    "publisher": "Publisher",
    "description": "Description",
    "keywords": "keyword1, keyword2",
    "imageUrl": "http://example.com/image.jpg",
    "genres": ["Fiction", "Mystery"],
    "copies": 3
  }
]`}
                            </pre>
                        </div>
                        <button type="submit" disabled={isLoading || !batchFile}>
                            {isLoading ? 'Uploading...' : 'Upload File'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSingleSubmit}>
                        {/* Title y Author en la misma línea */}
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                placeholder="Author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {/* Publisher e ISBN en la misma línea */}
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Publisher"
                                value={publisher}
                                onChange={(e) => setPublisher(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <input
                                type="text"
                                placeholder="ISBN"
                                value={isbn}
                                onChange={(e) => setISBN(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <input
                            type="number"
                            placeholder="Number of Copies"
                            min={1}
                            value={copies}
                            onChange={(e) => setCopies(Number(e.target.value))}
                            required
                            disabled={isLoading}
                        />

                        <Select
                            isMulti
                            options={genreOptions}
                            value={genres}
                            onChange={setGenres}
                            placeholder="Select genres..."
                            styles={customSelectStyles}
                            isDisabled={isLoading}
                        />

                        <input
                            type="text"
                            placeholder="Keywords (comma separated)"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            disabled={isLoading}
                        />

                        <input
                            type="text"
                            placeholder="Cover Image URL"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            required
                            disabled={isLoading}
                        />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddBook;