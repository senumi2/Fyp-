import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);


export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("User data parsing error:", error);
        logout(); 
      }
    }
    setLoading(false);
  }, []);

  // Login Function
  const login = (data) => {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    sessionStorage.setItem("role", data.user.jobRole);

    setToken(data.token);
    setUser(data.user);
  };

  // Logout Function
  const logout = () => {
    sessionStorage.clear(); 
    setUser(null);
    setToken(null);
    window.location.href = "/login"; 
  };

  
  const isAdmin = () => {
    return user?.jobRole === "Admin" || sessionStorage.getItem("role") === "Admin";
  };

  const contextValue = {
    user,
    token,
    login,
    logout,
    isAdmin, 
    isAuthenticated: !!token, 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};