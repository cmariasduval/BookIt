import React, { useState, useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    username: user?.username || "",
    birthDate: user?.birthDate || "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      // Si el usuario no está logueado, redirigir a login o mostrar un mensaje
      setMessage("No estás logueado");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = user?.token;

      // Enviar la solicitud PUT para actualizar los datos del usuario
      const response = await axios.put(
        `http://localhost:8080/api/users/${user.email}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setMessage("Datos actualizados correctamente");

        // Actualizar los datos en localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, ...formData })
        );
      }
    } catch (error) {
      console.error("Error actualizando los datos:", error);
      setMessage("Error al actualizar los datos. Intenta nuevamente.");
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nuevo nombre de usuario"
          />
        </div>
        <div className="form-group">
          <label htmlFor="birthDate">Fecha de nacimiento</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Nueva contraseña (opcional)</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Nueva contraseña"
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditProfile;
