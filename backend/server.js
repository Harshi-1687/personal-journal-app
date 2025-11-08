import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // 🆕 for cookies
import journalRoutes from "./routes/journalRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // 🆕 authentication routes

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // 👈 Vite default port
    credentials: true,               // 👈 allow cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // 🆕 lets Express read cookies from requests

app.use("/api/auth", authRoutes); // 🆕 register, login, logout, me
app.use("/api/journal", journalRoutes); // journal entries (protected)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
