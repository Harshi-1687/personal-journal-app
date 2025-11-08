import express from "express";
import auth from "../middleware/authMiddleware.js";
import JournalEntry from "../models/JournalEntry.js";

const router = express.Router();

// Protect all routes in this file - user must be authenticated
router.use(auth);

// ➕ POST: Add new journal entry (belongs to logged-in user)
router.post("/", async (req, res) => {
  try {
    const { text, mood, date } = req.body;

    if (!text || !mood) {
      return res.status(400).json({ message: "Text and mood are required." });
    }

    const entry = new JournalEntry({
      text,
      mood,
      date: date ? new Date(date) : new Date(),
      userId: req.user.id // set owner from auth middleware
    });

    await entry.save();
    return res.status(201).json(entry);
  } catch (error) {
    console.error("POST /journals error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// 📄 GET: Fetch all journal entries for the logged-in user
router.get("/", async (req, res) => {
  try {
    // Optionally you can accept query params for search, mood filter, sort, etc.
    const entries = await JournalEntry.find({ userId: req.user.id }).sort({ date: -1 });
    return res.status(200).json(entries);
  } catch (error) {
    console.error("GET /journals error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// ✏️ PUT: Update an entry (only if it belongs to the user)
router.put("/:id", async (req, res) => {
  try {
    const { text, mood, date } = req.body;
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    // Ownership check
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you don't own this entry" });
    }

    entry.text = text ?? entry.text;
    entry.mood = mood ?? entry.mood;
    if (date) entry.date = new Date(date);

    await entry.save();
    return res.json(entry);
  } catch (err) {
    console.error("PUT /journals/:id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// 🗑 DELETE: Delete an entry (only if it belongs to the user)
router.delete("/:id", async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    // Ownership check
    if (entry.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden: you don't own this entry" });
    }

    await entry.deleteOne();
    return res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    console.error("DELETE /journals/:id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
