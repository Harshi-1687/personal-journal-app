import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { fetchMe } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function showMessage(text, type = "error") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }

  async function backendLogin(email, password) {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res;
  }

  async function handleLogin(e) {
    e.preventDefault();
    if (!email.trim() || !password) return showMessage("Enter email & password");

    setLoading(true);
    try {
      const res = await backendLogin(email, password);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Login failed" }));
        showMessage(err.message || "Login failed");
        return;
      }
      await fetchMe();
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      showMessage("Network or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Log In</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Welcome back to your journal ✨</p>

        {message && (
          <div
            className={`p-3 mb-4 rounded-xl text-sm ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
