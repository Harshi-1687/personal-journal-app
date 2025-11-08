// frontend/src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AllEntriesPage from "./pages/AllEntriesPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthContext } from "./contexts/AuthContext";

export default function App() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
          <div className="text-gray-600">Checking authentication...</div>
        </div>
      </div>
    );
  }
  return (
    <Router>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/entries"
            element={user ? <AllEntriesPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/" replace />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>
    </Router>
  );
}
