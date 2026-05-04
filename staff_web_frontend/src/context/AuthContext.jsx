import React, { createContext, useState, useEffect } from "react";

// 1. Context එක export කිරීම
export const AuthContext = createContext(null);

/**
 * @description AuthProvider Component
 * සියලුම ලොගින් සහ රෝල් (Role) දත්ත කළමනාකරණය කරයි.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ✅ localStorage වෙනුවට sessionStorage භාවිතා කිරීමෙන් අලුත් Tab එකක් ඇරියම Logout වී පෙන්වයි
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // පිටුව පූරණය වන විට sessionStorage එකෙන් දත්ත ලබා ගැනීම
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
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
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("user", JSON.stringify(data.user));
    
    // 🔥 ඉතා වැදගත්: මෙය නොමැතිව Staff Dashboard එකේ Cards වැඩ කරන්නේ නැත
    sessionStorage.setItem("role", data.user.jobRole); 

    setToken(data.token);
    setUser(data.user);
  };

  // 🚪 Logout function
  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
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