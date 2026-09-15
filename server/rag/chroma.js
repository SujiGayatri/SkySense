import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

const client = new ChromaClient({
  host: process.env.CHROMA_HOST || "localhost",
  port: Number(process.env.CHROMA_PORT || 8000),
  ssl: process.env.CHROMA_SSL === "true",
});

const embeddingFunction = new DefaultEmbeddingFunction();

export async function getCollection() {
  return await client.getOrCreateCollection({
    name: "weather_knowledge",
    embeddingFunction,
  });
}