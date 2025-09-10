import { Navigate } from 'react-router-dom';
import React, { useContext } from 'react';
import { UserDataContext } from '../context/UserContext.jsx';

const AuthRedirect = ({ children }) => {
  const { user } = useContext(UserDataContext);
  console.log("user is logged in, redirecting to /home",user.isLoggedIn);
  if (user.isLoggedIn) {
    return <Navigate to="/home" replace/>;
  }

  return children;
};

export default AuthRedirect;
