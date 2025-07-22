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

    const getAuthToken = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Authentication token not found. Please log in again.");
            // You might want to redirect to login page here
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
            // Read and parse the JSON file
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

            // Validate that it's an array
            if (!Array.isArray(jsonContent)) {
                throw new Error("JSON file must contain an array of books");
            }

            // Make the API call
            const response = await fetch("http://localhost:8080/api/books/batch-upload/json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(jsonContent),
            });

            // Handle response
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                }

                // Try to get error details from response
                let errorMessage = `Request failed with status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If JSON parsing fails, use status text
                    errorMessage = `${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            // Handle success response
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
                <h2>{isBatchMode ? "Upload Books (Batch)" : "Add a New Book"}</h2>

                <div className="mode-switcher" style={{ marginBottom: '1rem' }}>
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
                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                        <p>Processing... Please wait.</p>
                    </div>
                )}

                {isBatchMode ? (
                    <form onSubmit={handleBatchSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="batch-file">Choose JSON file:</label>
                            <input
                                id="batch-file"
                                type="file"
                                accept=".json"
                                onChange={(e) => setBatchFile(e.target.files[0])}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                            <p><strong>JSON Format Example:</strong></p>
                            <pre style={{ background: '#f5f5f5', padding: '0.5rem', borderRadius: '4px' }}>
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