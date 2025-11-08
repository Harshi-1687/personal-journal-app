import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        navigate("/login");
      } else {
        console.error("Logout failed:", await res.text());
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <header className="flex items-center justify-between bg-indigo-200 px-6 py-3 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        🪶 Personal Journal
      </h2>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            👋 Hi, <strong>{user.name}</strong>
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <span className="text-gray-500 text-sm">Not logged in</span>
      )}
    </header>
  );
}
