const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const weatherRoutes = require("./routes/weather");
const favoritesRoutes = require("./routes/favorites");
const historyRoutes = require("./routes/history");

const app = express();

app.use(cors({ origin: ["http://localhost:5173","https://sky-sense-ixes.vercel.app"], credentials: true }));
app.use(express.json());

// Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/history", historyRoutes);

app.get("/api/health", (req, res) => res.json({ status: "SkySense API running" }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));