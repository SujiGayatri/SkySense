// const express = require("express");
const router = express.Router();
// const { getWeather } = require("../controllers/weatherController");
// const { getPromptQuery } = require("../controllers/ragController");
import express from "express";
import { getWeather } from "../controllers/weatherController.js";
import { getPromptQuery } from "../controllers/ragController.js";

// GET /api/weather?city=Vijayawada
// GET /api/weather?lat=16.5&lon=80.6
router.get("/", getWeather);
router.post("/ask", getPromptQuery);

// module.exports = router;
export default router;