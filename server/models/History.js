// const mongoose = require("mongoose");
import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    userId: { type: String, default: "default_user" },
    lat: { type: Number },
    lon: { type: Number },
    country: { type: String },
    weatherSnapshot: {
      temp: Number,
      description: String,
      humidity: Number,
      icon: String,
    },
  },
  { timestamps: true }
);

// module.exports = mongoose.model("History", historySchema);
export default mongoose.model("History", historySchema);
