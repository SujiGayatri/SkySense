import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
import weatherRoutes from "./routes/weather.js";
import favoritesRoutes from "./routes/favorites.js";
import historyRoutes from "./routes/history.js";


const app = express();

const allowedOrigins = [
  /^http:\/\/localhost:\d+$/,           // any localhost port (dev)
  /^https:\/\/[\w-]+\.vercel\.app$/,    // any *.vercel.app deployment
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Render health checks, curl)
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.some((pattern) => pattern.test(origin));
      if (allowed) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

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