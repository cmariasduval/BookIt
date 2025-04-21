import { useState, useEffect } from 'react';

const useAuth = () => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Al cargar el componente, verificamos si existe un token en el localStorage
    const token = localStorage.getItem('authToken');
    console.log("Token cargado desde localStorage:", token);
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const saveToken = (token) => {
    // Guarda el token en el localStorage y en el estado
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const removeToken = () => {
    // Elimina el token del localStorage y del estado
    localStorage.removeItem('authToken');
    setAuthToken(null);
  };

  return {
    authToken,
    saveToken,
    removeToken
  };
};

export default useAuth;
