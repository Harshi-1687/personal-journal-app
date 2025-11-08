import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function Signup() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { fetchMe } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function showMessage(text, type = "error") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  }

  async function backendRegister(email, password) {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: email.split("@")[0], email, password }),
    });
    return res;
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

  async function handleSignup(e) {
    e.preventDefault();
    if (!email.trim() || !password) return showMessage("Enter email & password");
    if (password.length < 6) return showMessage("Password must be 6+ characters");
    if (password !== confirmPassword) return showMessage("Passwords do not match");

    setLoading(true);
    try {
      const regRes = await backendRegister(email, password);
      if (!regRes.ok) {
        const err = await regRes.json().catch(() => ({ message: "Registration failed" }));
        showMessage(err.message || "Failed to register");
        return;
      }
      const loginRes = await backendLogin(email, password);
      if (!loginRes.ok) {
        showMessage("Registered but login failed. Please log in manually.");
        navigate("/login");
        return;
      }
      await fetchMe();
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      showMessage("Network or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Join us and start journaling your days 🌤️
        </p>

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

        <form onSubmit={handleSignup} className="space-y-4">
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
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 6 characters long.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
