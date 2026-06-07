const express = require("express");
const router = express.Router();
const History = require("../models/History");

// GET history for user (last 20 unique cities)
router.get("/", async (req, res) => {
  const userId = req.query.userId || "default_user";
  try {
    const history = await History.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    // Deduplicate by city, keep most recent
    const seen = new Set();
    const unique = history.filter((h) => {
      if (seen.has(h.city)) return false;
      seen.add(h.city);
      return true;
    });

    res.json(unique.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

// POST save a search to history
router.post("/", async (req, res) => {
  const {
    city,
    userId = "default_user",
    lat,
    lon,
    country,
    weatherSnapshot,
  } = req.body;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const entry = await History.create({
      city,
      userId,
      lat,
      lon,
      country,
      weatherSnapshot,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: "Failed to save history" });
  }
});

// DELETE clear all history
router.delete("/", async (req, res) => {
  const userId = req.query.userId || "default_user";
  try {
    await History.deleteMany({ userId });
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear history" });
  }
});

module.exports = router;
