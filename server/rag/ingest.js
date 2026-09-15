import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import WeatherKnowledge from "../models/WeatherKnowledge.js";
import { generateEmbedding } from "./embed.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = path.join(__dirname, "documents");

async function ingest() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const files = fs.readdirSync(folder);

    // Remove old knowledge documents
    await WeatherKnowledge.deleteMany({});

    for (const file of files) {
      if (!file.endsWith(".txt")) continue;

      const filePath = path.join(folder, file);

      const text = fs.readFileSync(filePath, "utf8");

      const category = file.replace(".txt", "");

      console.log(`Creating embedding for ${file}...`);

      const embedding = await generateEmbedding(text);

      await WeatherKnowledge.create({
        text,
        source: file,
        category,
        version: "1.0",
        embedding,
      });

      console.log(`${file} added`);
      console.log(`Embedding dimensions: ${embedding.length}`);
    }

    console.log("Ingestion completed successfully");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Ingestion failed:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
}

ingest();