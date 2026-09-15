import WeatherKnowledge from "../models/WeatherKnowledge.js";
import { generateEmbedding } from "./embed.js";

export async function retrieveDocuments(query) {
  const queryEmbedding = await generateEmbedding(query);

  const results = await WeatherKnowledge.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 10,
        limit: 2,
      },
    },
    {
      $project: {
        _id: 0,
        text: 1,
        source: 1,
        category: 1,
        version: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  return results.map((doc) => ({
    document: doc.text,
    metadata: {
      source: doc.source,
      category: doc.category,
      version: doc.version,
    },
    score: doc.score,
  }));
}