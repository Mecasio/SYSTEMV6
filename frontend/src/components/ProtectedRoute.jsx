// ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (allowedRoles.length === 0 || allowedRoles.includes(decoded.role)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized('unauthorized');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setIsAuthorized(false);
    }
  }, [allowedRoles]);

  if (isAuthorized === null) return null; // optional: add a loading spinner

  if (isAuthorized === true) {
    return children;
  } else if (isAuthorized === 'unauthorized') {
    return <Navigate to="/unauthorized" />;
  } else {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
