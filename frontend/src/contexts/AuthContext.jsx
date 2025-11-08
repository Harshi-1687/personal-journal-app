import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user from backend (uses HttpOnly cookie accessToken)
  async function fetchMe() {
    setLoading(true);
    const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const url = `${API}/api/auth/me`;
    console.log("fetchMe →", url);
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("fetchMe error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}
