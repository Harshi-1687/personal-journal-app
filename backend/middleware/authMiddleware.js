// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    // prefer cookie-based token; fallback to Authorization header (Bearer)
    const token =
      req.cookies?.accessToken ||
      (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    console.error("authMiddleware:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
