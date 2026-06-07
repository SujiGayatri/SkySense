const express = require("express");
const router = express.Router();
const { getWeather } = require("../controllers/weatherController");

// GET /api/weather?city=Vijayawada
// GET /api/weather?lat=16.5&lon=80.6
router.get("/", getWeather);

module.exports = router;
