import React from 'react';
import { Navigate } from 'react-router-dom';



interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated,children }) => {

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, render the child components
  return <>{children}</>;
};
