import React, { createContext, useState, useEffect } from "react";

// 1. Context එක export කිරීම (Vite එකට මෙය ගැටලුවක් නොවන පරිදි)
export const AuthContext = createContext(null);

/**
 * @description AuthProvider Component
 * සියලුම ලොගින් සහ රෝල් (Role) දත්ත කළමනාකරණය කරයි.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // පිටුව පූරණය වන විට localStorage එකෙන් දත්ත ලබා ගැනීම
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("User data parsing error:", error);
      }
    }
    setLoading(false);
  }, []);

  // 🔐 Login function - Staff Cards Unlock වීමට 'role' එක අනිවාර්යයෙන්ම save කරයි
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    // 🔥 ඉතා වැදගත්: මෙය නොමැතිව Staff Dashboard එකේ Cards වැඩ කරන්නේ නැත
    localStorage.setItem("role", data.user.jobRole); 

    setToken(data.token);
    setUser(data.user);
  };

  // 🚪 Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setToken(null);
  };

  // contextValue එක එකම object එකක් ලෙස අර්ථ දැක්වීම (Vite Fast Refresh සඳහා)
  const contextValue = {
    user,
    token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};