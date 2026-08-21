import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Optionally, render a loading indicator while checking user data
    return <></>;
  }

  if (!user) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/login" replace/>;
  }

  if (role && user.role !== role) {
    // If the user does not have the required role, redirect to an appropriate page
    return <Navigate to="/" />;
  }

  // If the user has the required role, render the children components
  return children;
};

export default ProtectedRoute;