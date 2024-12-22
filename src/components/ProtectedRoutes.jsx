// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Check if token exists
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Attempt to decode the token
    jwtDecode(token);
    return children; // If valid token, render children (Dashboard)
  } catch (error) {

    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute; 