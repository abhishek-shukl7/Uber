import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { DriverDataContext } from '../context/DriverContext.jsx';

const AuthDriverRedirect = ({ children }) => {
  const { isLoggedIn } = useContext(DriverDataContext);
  console.log("driver is logged in, redirecting to /home",isLoggedIn);
  if (isLoggedIn) {
    return <Navigate to="/driver/home" replace/>;
  }

  return children;
};

export default AuthDriverRedirect;
