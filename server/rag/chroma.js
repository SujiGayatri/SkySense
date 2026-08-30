import { ChromaClient } from "chromadb";

export const client = new ChromaClient({
  host: process.env.CHROMA_HOST || "localhost",
  port: Number(process.env.CHROMA_PORT || 8000),
  ssl: process.env.CHROMA_SSL === "true",
});

export async function getCollection() {
  return await client.getOrCreateCollection({
    name: "weather_knowledge",
  });
}