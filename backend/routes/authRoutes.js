// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const ACCESS_EXP = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_EXP = process.env.REFRESH_TOKEN_EXPIRY || "7d";

function createAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_EXP,
  });
}
function createRefreshToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_EXP,
  });
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ message: "Name, email and password required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    return res.status(201).json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password needed" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // Cookies: HttpOnly so JS can't read them
    const atCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 min
      path: "/",
    };
    const rtCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    res.cookie("accessToken", accessToken, atCookie);
    res.cookie("refreshToken", refreshToken, rtCookie);

    return res.json({ id: user._id, email: user.email, name: user.name });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Refresh access token
router.post("/refresh", (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_EXP,
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Refresh error:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  return res.json({ ok: true });
});

// Me (returns current user info based on access token cookie)
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("Me error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
