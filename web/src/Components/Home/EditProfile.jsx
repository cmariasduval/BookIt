import React, { useState, useEffect } from "react";
import "./EditProfile.css";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const [formData, setFormData] = useState({
    username: "",
    birthDate: "",
    newPassword: "",
  });
  const [interests, setInterests] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Lista de todos los géneros con sus IDs
  const allInterests = [
    { id: 1, genreType: "Psychology" },
    { id: 2, genreType: "Historical" },
    { id: 3, genreType: "Romance" },
    { id: 4, genreType: "Sci-Fi" },
    { id: 5, genreType: "Non-Fiction" },
    { id: 6, genreType: "Horror" },
    { id: 7, genreType: "Thriller" },
    { id: 8, genreType: "Fantasy" },
    { id: 9, genreType: "Mystery" },
    { id: 10, genreType: "Fiction" },
  ];

  // Carga inicial de datos (desde localStorage)
  useEffect(() => {
    if (!user) {
      setMessage("No estás logueado");
      return;
    }
    setFormData({
      username: user.username || "",
      birthDate: user.birthDate || "",
      newPassword: "",
    });
    setInterests(user.interests || []);
  }, []);

  // Toggle de selección de intereses
  const toggleInterest = (genreType) => {
    setInterests((prev) => {
      const exists = prev.some((g) => g.genreType === genreType);
      if (exists) {
        return prev.filter((g) => g.genreType !== genreType);
      } else {
        const found = allInterests.find((g) => g.genreType === genreType);
        return [...prev, found];
      }
    });
  };

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // Envío de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    // 1. Recuperar token
    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("No autorizado: volvé a loguearte.");
      return;
    }
  
    // 2. Armar payload
    const payload = {
      username: formData.username,
      birthDate: formData.birthDate,
      interests: interests.map((g) => ({ id: g.id })), // enviamos solo IDs
      // Si también querés incluir genreType:
      interests: interests,
      ...(formData.newPassword && { newPassword: formData.newPassword }),
    };
  
    console.log("Auth token:", token);
    console.log("Payload:", payload);
  
    try {
      // 3. Hacer fetch
      const response = await fetch("http://localhost:8080/user/update", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      // 4. Chequear respuesta
      if (response.ok) {
        // Si devolvés un JSON con el user actualizado:
        const updated = await response.json();
  
        setMessage("Datos actualizados correctamente");
  
        const isAdmin = user.email.endsWith("@admin.com");
        // 5. Actualizar localStorage con lo que venga del back
        const updatedUser = {
          ...user,
          username: updated.username,
          birthDate: updated.birthDate,
          interests: updated.interests,
          role: isAdmin ? "admin" : "user",
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
  
        setTimeout(() => navigate("/profile"), 1000);
      } else if (response.status === 401) {
        setMessage("No autorizado. Por favor volvé a loguearte.");
      } else {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        setMessage("Error al actualizar los datos. Intenta nuevamente.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error al conectar con el servidor.");
    }
  };
  

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-title">
        <button type="button" onClick={() => navigate("/profile")}>
          <IoMdArrowBack size={24} />
        </button>
        <h2>Edit Profile</h2>
      </div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nuevo nombre de usuario"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Birth Date</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password (opcional)</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Nueva contraseña"
          />
        </div>
        <div className="form-group">
          <label>Interests</label>
          <div className="interests-buttons">
            {allInterests.map((interest) => (
              <button
                key={interest.id}
                type="button"
                className={
                  interests.some((g) => g.genreType === interest.genreType)
                    ? "selected"
                    : ""
                }
                onClick={() => toggleInterest(interest.genreType)}
              >
                {interest.genreType}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
);

};

export default EditProfile;
