import mongoose from "mongoose";

const weatherKnowledgeSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      default: "1.0",
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    collection: "weather_knowledge",
  }
);

export default mongoose.model(
  "WeatherKnowledge",
  weatherKnowledgeSchema
);