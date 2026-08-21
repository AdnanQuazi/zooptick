import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminAuthContext } from '../../Context/AdminContext';


const ProtectedRouteAdmin = ({ role, children }) => {
  const { admin, loading } = useContext(AdminAuthContext);

  if (loading) {
    // Optionally, render a loading indicator while checking user data
    return <></>;
  }

  if (!admin) {
    // If the user is not authenticated, redirect to login
    return <Navigate to="/admin/login" replace/>;
  }

//   if (role && user.role !== role) {
//     // If the user does not have the required role, redirect to an appropriate page
//     return <Navigate to="/" />;
//   }

  // If the user has the required role, render the children components
  return children;
};

export default ProtectedRouteAdmin;