import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Cookies from 'js-cookie';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  // Function to check if the user is already authenticated
  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');
    const storedUserType = localStorage.getItem('userType');

    if (token) {
      setIsAuthenticated(true);
      setUserType(storedUserType);
    }
    setLoading(false); // Update loading status once done
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback((token, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    setIsAuthenticated(true);
    setUserType(userType);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    Cookies.remove('access_token');
    Cookies.remove('user_name');
    Cookies.remove('user_id');
    Cookies.remove('user_email');
    Cookies.remove('is_customer');
    Cookies.remove('is_driver');
    Cookies.remove('is_admin');
    Cookies.remove('name');
    setIsAuthenticated(false);
    setUserType(null);
  }, []);

  const contextValue = {
    isAuthenticated,
    userType,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
