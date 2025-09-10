import { createContext, useState, useContext } from 'react';

// Create a context for our authentication state
export const AuthDriverContext = createContext(null);

export const AuthDriverProvider = ({ children }) => {
  // We use a simple boolean to simulate the login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // A function to flip the login status
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const authValue = { isLoggedIn, toggleLogin };

  // This provider component wraps all parts of the app that need auth state
  return (
    <AuthDriverContext.Provider value={authValue}>
      {children}
    </AuthDriverContext.Provider>
  );
};

export default AuthDriverProvider;
// A custom hook to easily access the auth context in any component
// export const useAuth = () => useContext(AuthContext);
