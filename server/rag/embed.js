import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

const embedder = new DefaultEmbeddingFunction();

export async function generateEmbedding(text) {
  const embeddings = await embedder.generate([text]);

  return embeddings[0];
}

