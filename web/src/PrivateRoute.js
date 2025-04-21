import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';  // Importamos el hook

const PrivateRoute = ({ element }) => {
  const { authToken } = useAuth();  // Obtenemos el token

  // Si no hay token, redirige al login
  if (!authToken) {
    return <Navigate to="/" />;
  }

  // Si hay token, retorna el componente original
  return element;
};

export default PrivateRoute;
