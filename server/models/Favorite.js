// const mongoose = require("mongoose");
import mongoose from "mongoose";
const favoriteSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    userId: { type: String, default: "default_user" }, // extend with auth later
    lat: { type: Number },
    lon: { type: Number },
    country: { type: String },
  },
  { timestamps: true }
);

favoriteSchema.index({ city: 1, userId: 1 }, { unique: true });

// module.exports = mongoose.model("Favorite", favoriteSchema);
export default mongoose.model("Favorite", favoriteSchema);
