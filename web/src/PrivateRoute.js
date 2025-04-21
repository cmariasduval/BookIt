import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';

const PrivateRoute = ({ element }) => {
  const { authToken } = useAuth();

  // Si no hay token, redirige al login
  if (!authToken) {
    return <Navigate to="/" replace />;  // El 'replace' evita que el usuario regrese al login al presionar el botón de atrás
  }

  // Si hay token, retorna el componente original
  return element;
};

export default PrivateRoute;
