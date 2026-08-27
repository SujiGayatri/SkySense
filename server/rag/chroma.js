import { ChromaClient } from "chromadb";

export const client = new ChromaClient({
  host: "localhost",
    port: 8000,
    ssl: false,
});

export async function getCollection() {
  return await client.getOrCreateCollection({
    name: "weather_knowledge"
  });
}