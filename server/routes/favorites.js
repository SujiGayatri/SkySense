// const express = require("express");
const router = express.Router();
// const Favorite = require("../models/Favorite");
import express from "express";
import Favorite from "../models/Favorite.js";

// GET all favorites for user
router.get("/", async (req, res) => {
  const userId = req.query.userId || "default_user";
  try {
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

// POST add a favorite
router.post("/", async (req, res) => {
  const { city, userId = "default_user", lat, lon, country } = req.body;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const fav = await Favorite.findOneAndUpdate(
      { city, userId },
      { city, userId, lat, lon, country },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ error: "Failed to save favorite" });
  }
});

// DELETE remove a favorite
router.delete("/:city", async (req, res) => {
  const userId = req.query.userId || "default_user";
  try {
    await Favorite.findOneAndDelete({ city: req.params.city, userId });
    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

// GET check if a city is favorited
router.get("/check/:city", async (req, res) => {
  const userId = req.query.userId || "default_user";
  try {
    const fav = await Favorite.findOne({ city: req.params.city, userId });
    res.json({ isFavorite: !!fav });
  } catch (err) {
    res.status(500).json({ error: "Check failed" });
  }
});

// module.exports = router;
export default router;