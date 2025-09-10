import { createContext, useState, useContext } from 'react';

// Create a context for our authentication state
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // We use a simple boolean to simulate the login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // A function to flip the login status
  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  const authValue = { isLoggedIn, toggleLogin };

  // This provider component wraps all parts of the app that need auth state
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
// A custom hook to easily access the auth context in any component
// export const useAuth = () => useContext(AuthContext);
