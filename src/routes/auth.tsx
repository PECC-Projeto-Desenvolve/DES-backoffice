import React from 'react';
import { Navigate } from 'react-router-dom';

interface IPrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }:IPrivateRouteProps) => {
  const isAuthenticated = localStorage.getItem('authenticated');

  if (isAuthenticated == 'true') {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;




