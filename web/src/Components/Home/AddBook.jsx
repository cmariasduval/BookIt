import "./AddBook.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";

const AddBook = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(1);
  const [genres, setGenres] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState(null);

  const genreOptions = [
    { value: "Psychology", label: "Psychology" },
    { value: "Non-fiction", label: "Non-fiction" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Science Fiction", label: "Science Fiction" },
    { value: "Thriller", label: "Thriller" },
    { value: "Mystery", label: "Mystery" },
    { value: "Romance", label: "Romance" },
    { value: "Historical", label: "Historical" },
    { value: "Horror", label: "Horror" },
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
      fontSize: '1rem'
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

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("copies", copies);
    formData.append("keywords", keywords);
    formData.append("image", image);

    genres.forEach((g, i) => {
        formData.append(`genres[${i}]`, g.value); // solo el valor, no el label
      });

      const user = JSON.parse(localStorage.getItem("user")); // recuperar el token guardado
      const token = user?.token; // si existe user, saca el token

      console.log("Token en el frontend:", token);

      if (!token) {
        console.log("No token found, user is not logged in!");
        alert("You need to be logged in to add a book.");
        return;
      }
  
      console.log("Datos del formulario que se envían al backend:");
      console.log("Title:", title);
      console.log("Author:", author);
      console.log("Description:", description);
      console.log("Copies:", copies);
      console.log("Genres:", genres);
      console.log("Keywords:", keywords);

      fetch('http://localhost:8080/books', {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`  // <<< AGREGÁS ESTO
          },
          body: JSON.stringify({
            title,
            author,
            description,
            copies,
            keywords,
            genres: genres.map(g => g.value), // Solo enviamos los valores
            image: image // Esto debería enviarse como parte de un FormData si es necesario, pero aquí lo dejamos como texto por simplicidad
          })
      })
      .then((res) => {
        console.log("Respuesta del backend:", res);
      return res.json();
       })
      .then((data) => {
        console.log("Book added:", data);
        closeModal();
      })
      .catch((err) => {
        console.error("Error al agregar el libro:", err);
      alert("Hubo un error al agregar el libro.");
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
            styles={customSelectStyles}
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
            required
          />

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
