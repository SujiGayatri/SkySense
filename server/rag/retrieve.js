import { getCollection } from "./chroma.js";

export async function retrieveDocuments(query) {
  const collection = await getCollection();

  const results = await collection.query({
    queryTexts: [query],
    nResults: 2,
  });

  const docs = results.documents[0] || [];
  const meta = results.metadatas[0] || [];
  const scores = results.distances[0] || [];

  return docs.map((doc, i) => ({
    document: doc,
    metadata: meta[i],
    score: scores[i],
  }));
}